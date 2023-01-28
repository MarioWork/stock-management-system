require('dotenv').config();

const fp = require('fastify-plugin');

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const { PluginNames } = require('../enums/plugins');
const serviceAccount = require('../../credentials.json');

const plugin = async server => {
    server.log.info(`Registering ${PluginNames.FIREBASE} plugin...`);

    try {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET
        });

        const storageBucket = getStorage().bucket();

        server.decorate('storage', storageBucket);
    } catch (error) {
        server.log.error(error);
    }
};

const options = { name: PluginNames.FIREBASE };

module.exports = fp(plugin, options);
