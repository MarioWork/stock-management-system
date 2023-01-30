/**
 * @typedef { import("../types/prisma-docs-type") } PrismaClient
 * @typedef { import("../types/file-docs-type") } File
 */

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
const getFile = (prisma, id) => {
    return getFilePrisma(prisma, id);
};

//TODO:: Add docs
const deleteFile = async ({ storage, prisma }, id) => {
    const { type } = (await getFilePrisma(prisma, id)) || {};

    if (!type) throw 404;

    const [{ count }] = await Promise.all([
        deleteFilePrisma(prisma, id),
        deleteFileCloud(storage, { id, type })
    ]);

    return count;
};

//TODO: Add docs
const downloadFile = async ({ storage, prisma }, { id }) => {
    const { type } = (await getFile(prisma, id)) || {};
    return downloadFileCloud(storage, { id, type });
};

module.exports = {
    getFile,
    deleteFile,
    downloadFile
};
