const fp = require('fastify-plugin');

const { PluginNames } = require('../enums/plugins');

const { errorMapper } = require('../utils/error-mapper');

const plugin = (server, _, done) => {
    server.log.info(`Registering ${PluginNames.HTTP_ERROR} plugin...`);

    server.decorate('toHttpError', error => {
        server.log.error(error);

        return errorMapper(error);
    });

    done();
};

const options = { name: PluginNames.HTTP_ERROR };

module.exports = fp(plugin, options);
