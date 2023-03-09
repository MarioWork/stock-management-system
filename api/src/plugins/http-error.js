const fp = require('fastify-plugin');

const { PluginNames } = require('../enums/plugins');

const { BadRequest, InternalServerError } = require('http-errors');

const plugin = (server, _, done) => {
    server.log.info(`Registering ${PluginNames.HTTP_ERROR} plugin...`);

    const errorMapper = error => {
        const code = error?.code ?? error?.statusCode;
        const message = error.message;

        const map = new Map();
        map.set(400, new BadRequest(message));
        return map.get(code) ?? new InternalServerError();
    };

    server.decorate('toHttpError', error => errorMapper(error));

    done();
};

const options = { name: PluginNames.HTTP_ERROR };

module.exports = fp(plugin, options);
