/**
 * @typedef { import("../types/prisma-docs-type") } PrismaClient
 * @typedef { import("../types/file-docs-type") } File
 */
const { NotFound } = require('http-errors');

const {
    deleteFile: deleteFilePrisma,
    getFile: getFilePrisma
} = require('../services/prisma/file-service');

const {
    deleteFile: deleteFileCloud,
    downloadFile: downloadFileCloud
} = require('../services/cloud-storage/cloud-file-service');

/**
 * Retrieves a file info by Id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - File UUID
 * @returns {Promise<File>}
 * @throws {error}
 */
const getFile = (prisma, id) => getFilePrisma(prisma, id);

/**
 * Deletes file from database and cloud storage by Id
 * @param {{storage:*,prisma: PrismaClient}} object - Dependencies object
 * @param {string} id - file Id
 * @returns Returns the deleted file
 * @throws {error}
 */
const deleteFile = async ({ storage, prisma }, id) => {
    const { type } = (await getFilePrisma(prisma, id)) || {};

    if (!type) throw new NotFound('Image not found');

    const [deleteFile] = await Promise.all([
        deleteFilePrisma(prisma, id),
        deleteFileCloud(storage, { id, type })
    ]);

    return deleteFile;
};

/**
 * Downloads file buffer from cloud by Id
 * @param {{storage:*,prisma: PrismaClient}} object - Dependencies object
 * @param {string} id - file Id
 * @returns Returns the buffer of the file
 * @throws {error}
 */
const downloadFile = async ({ storage, prisma }, id) => {
    const { type } = (await getFile(prisma, id)) || {};

    if (!type) throw new NotFound();

    return downloadFileCloud(storage, { id, type });
};

module.exports = {
    getFile,
    deleteFile,
    downloadFile
};
