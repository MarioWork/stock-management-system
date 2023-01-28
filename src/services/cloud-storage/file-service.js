require('dotenv').config();

const BASE_PATH = 'images/';
const { randomUUID } = require('crypto');
const util = require('util');
const { pipeline } = require('stream');

const pipelineAsync = util.promisify(pipeline);

/**
 * Saves a file to storage bucket
 * @param {*} storage - Storage bucket instance
 * @param {{file: FileStream, type: string}} object - Object with file: FileStream and type: string
 * @returns {{url: string, fileId: number}} - Object with file url and fileID
 * @throws {error}
 */
const saveFile = async (storage, { file, type }) => {
    const randomID = randomUUID();

    const fileName = randomID + '.' + type;

    const fileRef = storage.file(BASE_PATH + fileName);

    await pipelineAsync(file, fileRef.createWriteStream(fileName));

    return { url: process.env.IMAGE_BASE_URL + randomID + '?type=' + type, fileId: randomID };
};

/**
 * Downloads file from storage bucket and return its buffer
 * @param {*} storage - Storage bucket instance
 * @param {{file: FileStream, type: string}} object - Object with file: FileStream and type: string
 * @returns {Buffer} - File Buffer
 * @throws {error}
 */
const downloadFile = async (storage, { id, type }) => {
    return await storage.file(BASE_PATH + id + '.' + type).download();
};

/**
 * Deletes a file from the storage bucket
 * @param {*} storage - Storage bucket instance
 * @param {{file: FileStream, type: string}} object - Object with file: FileStream and type: string
 * @returns
 * @throws {error}
 */
const deleteFile = async (storage, { id, type }) => {
    return await storage.file(BASE_PATH + id + '.' + type).delete();
};

module.exports = {
    saveFile,
    downloadFile,
    deleteFile
};
