const fp = require('fastify-plugin');
const { getAuth } = require('firebase-admin/auth');

const { PluginNames } = require('../enums/plugins');

const plugin = (server, _, done) => {
    server.log.info(`Registering ${PluginNames.AUTHENTICATION} plugin...`);

    try {
        server.decorate('authService', getAuth());
    } catch (error) {
        server.log.error(error);
    }

    done();
};

const options = {
    name: PluginNames.AUTHENTICATION,
    dependencies: [PluginNames.FIREBASE]
};

module.exports = fp(plugin, options);
