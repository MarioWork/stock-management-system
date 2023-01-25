require('dotenv').config();

const fp = require('fastify-plugin');

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('../../credentials.json');

const NAME = 'Firebase';

const plugin = async server => {
    server.log.info(`Registering ${NAME} plugin...`);

    try {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: 'products-stock.appspot.com'
        });

        const storage = getStorage().bucket();

        server.decorate('storage', storage);
    } catch (error) {
        server.log.error(error);
    }
};

const options = { name: NAME };

module.exports = fp(plugin, options);
