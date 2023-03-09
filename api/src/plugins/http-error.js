const fp = require('fastify-plugin');

const { PluginNames } = require('../enums/plugins');

const plugin = (server, _, done) => {
    server.log.info(`Registering ${PluginNames.HTTP_ERROR} plugin...`);

    const { httpErrors } = server;

    server.decorate('toHttpError', (error, context) => {
        if (error?.statusCode === 400) {
            return httpErrors.badRequest(error.message);
        }
    });

    done();
};

const options = { name: PluginNames.HTTP_ERROR };

module.exports = fp(plugin, options);
