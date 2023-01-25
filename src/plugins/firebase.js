require('dotenv').config();

const fp = require('fastify-plugin');
const { initializeApp } = require('firebase/app');

const NAME = 'Firebase';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const plugin = async server => {
    server.log.info(`Registering ${NAME} plugin...`);

    try {
        const firebaseApp = initializeApp(firebaseConfig);
    } catch (error) {
        server.log.error(error);
    }
};

const options = { name: NAME };

module.exports = fp(plugin, options);
