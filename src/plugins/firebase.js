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

const plugin = async server => {
    server.log.info(`Registering ${PluginNames.FIREBASE} plugin...`);

    try {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.STORAGE_BUCKET
        });

        const storageBucket = getStorage().bucket();

        //TODO: Move this to firebase service
        server.decorate('saveFile', async (file, type) => {
            const randomID = randomUUID();

            const fileName = randomID + '.' + type;

            const fileRef = storageBucket.file('images/' + fileName);

            await pipelineAsync(file, fileRef.createWriteStream(fileName));

            return process.env.IMAGE_BASE_URL + randomID + '?type=' + type;
        });

        //TODO: MOve this to firebase service
        server.decorate('downloadFile', async (fileId, type) => {
            return await storageBucket.file('images/' + fileId + '.' + type).download();
        });
    } catch (error) {
        server.log.error(error);
    }
};

const options = { name: PluginNames.FIREBASE };

module.exports = fp(plugin, options);
