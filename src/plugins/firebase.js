require('dotenv').config();
const util = require('util');
const { pipeline } = require('stream');
const { randomUUID } = require('crypto');

const pipelineAsync = util.promisify(pipeline);

const fp = require('fastify-plugin');

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const { PluginNames } = require('../enums/plugins');
const serviceAccount = require('../../credentials.json');

const FILE_URL_EXPIRATION_DATE = '01-01-2026';

const plugin = async server => {
    server.log.info(`Registering ${PluginNames.FIREBASE} plugin...`);

    try {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET
        });

        const storageBucket = getStorage().bucket();

        server.decorate('saveFile', async (file, filename, productId) => {
            const randomID = randomUUID();
            const fileRef = storageBucket.file(
                'images/' + productId + '/' + randomID + '/' + filename
            );

            await pipelineAsync(file, fileRef.createWriteStream(filename));

            return fileRef.getSignedUrl({ action: 'read', expires: FILE_URL_EXPIRATION_DATE });
        });
    } catch (error) {
        server.log.error(error);
    }
};

const options = { name: PluginNames.FIREBASE };

module.exports = fp(plugin, options);