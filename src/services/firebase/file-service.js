require('dotenv').config();

const { randomUUID } = require('crypto');
const util = require('util');
const { pipeline } = require('stream');

const pipelineAsync = util.promisify(pipeline);

//TODO: Add docs
const saveFile = async (storage, { file, type }) => {
    const randomID = randomUUID();

    const fileName = randomID + '.' + type;

    const fileRef = storage.file('images/' + fileName);

    await pipelineAsync(file, fileRef.createWriteStream(fileName));

    return process.env.IMAGE_BASE_URL + randomID + '?type=' + type;
};

//TODO: Add docs
const downloadFile = async (storage, { id, type }) => {
    return await storage.file('images/' + id + '.' + type).download();
};

module.exports = {
    saveFile,
    downloadFile
};
