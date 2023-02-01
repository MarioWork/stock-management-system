require('dotenv').config();

const fp = require('fastify-plugin');
const { getStorage } = require('firebase-admin/storage');

const { PluginNames } = require('../enums/plugins');

const plugin = async server => {
    server.log.info(`Registering ${PluginNames.CLOUD_STORAGE} plugin...`);

    try {
        const storageBucket = getStorage().bucket();

        server.decorate('storage', storageBucket);
    } catch (error) {
        server.log.error(error);
    }
};

const options = { name: PluginNames.CLOUD_STORAGE, dependencies: [PluginNames.FIREBASE] };

module.exports = fp(plugin, options);
