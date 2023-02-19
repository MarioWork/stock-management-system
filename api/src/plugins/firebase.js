require('dotenv').config();

const fp = require('fastify-plugin');

const { initializeApp, cert } = require('firebase-admin/app');

const { PluginNames } = require('../enums/plugins');

const plugin = (server, _, done) => {
    server.log.info(`Registering ${PluginNames.FIREBASE} plugin...`);

    const serviceAccount = {
        type: process.env.SERVICE_ACCOUNT_TYPE,
        project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
        private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
        private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
        client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
        client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
        auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
        token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL
    };

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
