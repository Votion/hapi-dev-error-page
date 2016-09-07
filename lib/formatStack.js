'use strict';

const escapeHtml = require('escape-html');

function formatStack(stack) {
    stack = escapeHtml(stack);

    const lines = stack.split('\n');
    const cwdRe = new RegExp('^(' + reEscape(process.cwd()) + ')?(.*)$');

    const formattedLines = lines.map(function(line) {
        if (line.substr(0, 7) === '    at ') {

            line = line.replace(/(\()?(\S+:\d+:\d+)(\))?$/, function(full, openParen, url, closeParen) {
                const formattedUrl = url.replace(/^(\S+):(\d+):(\d+)$/, function(full, file, line, col) {
                    const formattedFile = file.replace(cwdRe, function(full, cwd, file) {
                        return `<span class="Stack-file-cwd">${cwd || ''}</span><span class="Stack-file-file">${file || ''}</span>`;
                    });
                    return `${formattedFile}:<span class="Stack-line">${line}</span>:<span class="Stack-col">${col}</span>`;
                });
                return `${openParen || ''}<a class="Stack-file" href="http://localhost:63342/api/file/${url}">${formattedUrl}</a>${closeParen || ''}`;
            });

            line = line.replace(/^(\s+at )([^(]+)\(/, '$1<span class="Stack-callName">$2</span>(');

            line = `<span class="Stack-Level">${line}</span>`;
        }

        return line;
    });

    return formattedLines.join('\n');
}

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

function reEscape(str) {
    return str.replace(matchOperatorsRe, '\\$&');
}

module.exports = formatStack;
