/**
 * @typedef { import("../types/prisma-docs-type") } PrismaClient
 * @typedef { import("../types/file-docs-type") } File
 */

//TODO: Move to service
/**
 * Retrieves a file info by Id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - File UUID
 * @returns {Promise<File>}
 * @throws {error}
 */
const getFile = (prisma, id) => {
    return prisma.file.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            url: true,
            type: true
        }
    });
};

module.exports = {
    getFile
};
