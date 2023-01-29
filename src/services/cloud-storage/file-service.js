require('dotenv').config();

const BASE_PATH = 'images/';
const { randomUUID } = require('crypto');
const util = require('util');
const { pipeline } = require('stream');

const pipelineAsync = util.promisify(pipeline);

const { getFile } = require('../../controllers/file-controller');

const createBucketObjPath = ({ id, type }) => BASE_PATH + id + '.' + type;

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

    return { fileUrl: process.env.IMAGE_BASE_URL + randomID, fileId: randomID };
};

/**
 * Downloads file from storage bucket and return its buffer
 * @param {*} storage - Storage bucket instance
 * @param {{file: FileStream, type: string}} object - Object with file: FileStream and type: string
 * @returns {Buffer} - File Buffer
 * @throws {error}
 */
//TODO: update docs depndencies
const downloadFile = async ({ storage, prisma }, { id }) => {
    const { type } = await getFile(prisma, id);
    return await storage.file(createBucketObjPath({ id, type })).download();
};

/**
 * Deletes a file from the storage bucket
 * @param {*} storage - Storage bucket instance
 * @param {{id: number, type: string}} object - Object with file: FileStream and type: string
 * @returns
 * @throws {error}
 */
const deleteFile = async (storage, { id, type }) =>
    await storage.file(createBucketObjPath({ id, type })).delete();

module.exports = {
    saveFile,
    downloadFile,
    deleteFile
};
