require('dotenv').config();

const fp = require('fastify-plugin');

const { initializeApp, cert } = require('firebase-admin/app');

const { PluginNames } = require('../enums/plugins');
const serviceAccount = require('../../credentials.json');

const plugin = (server, _, done) => {
    server.log.info(`Registering ${PluginNames.FIREBASE} plugin...`);

    try {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET
        });
    } catch (error) {
        server.log.error(error);
    }

    done();
};

const options = { name: PluginNames.FIREBASE };

module.exports = fp(plugin, options);
