/**
 * @typedef { import("../types/prisma-docs-type") } PrismaClient
 * @typedef { import("../types/file-docs-type") } File
 */

const {
    deleteFile: deleteFilePrisma,
    getFile: getFilePrisma
} = require('../services/prisma/file-service');

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
const deleteFile = (prisma, id) => {
    return deleteFilePrisma(prisma, id);
};

module.exports = {
    getFile,
    deleteFile
};
