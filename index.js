'use strict';

const fs = require('fs');
const path = require('path');
const formatStack = require('./lib/formatStack');

let template = '';
fs.readFile(path.join(__dirname, './lib/DeveloperErrorPage.html'), 'utf8', function (err, contents) {
    if (err) {
        throw err;
    }

    template = contents;
});

function handleDevErrorPage(request, reply){
    if (request.response.isBoom) {
        const err = request.response;
        const errName = err.output.payload.error;
        const statusCode = err.output.payload.statusCode;
        const message = err.output.payload.message;

        const props = {
            code: statusCode,
            name: errName,
            message: message,
            stack: formatStack(err.stack)
        };

        const output = template.replace(/%(\w+)%/g, function(full, token) {
            return props[token] || '';
        });

        return reply(output).code(statusCode);
    } else {
        reply.continue();
    }
}

module.exports = handleDevErrorPage;