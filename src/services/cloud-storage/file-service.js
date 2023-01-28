require('dotenv').config();

const BASE_PATH = 'images/';
const { randomUUID } = require('crypto');
const util = require('util');
const { pipeline } = require('stream');

const pipelineAsync = util.promisify(pipeline);

//TODO: Add docs
const saveFile = async (storage, { file, type }) => {
    const randomID = randomUUID();

    const fileName = randomID + '.' + type;

    const fileRef = storage.file(BASE_PATH + fileName);

    await pipelineAsync(file, fileRef.createWriteStream(fileName));

    return { url: process.env.IMAGE_BASE_URL + randomID + '?type=' + type, fileId: randomID };
};

//TODO: Add docs
const downloadFile = async (storage, { id, type }) => {
    return await storage.file(BASE_PATH + id + '.' + type).download();
};

const deleteFile = async (storage, { id, type }) => {
    return await storage.file(BASE_PATH + id + '.' + type).delete();
};

module.exports = {
    saveFile,
    downloadFile,
    deleteFile
};
