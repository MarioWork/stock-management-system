/**
 * @typedef { import("../../types/prisma-docs-type") } PrismaClient
 */

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
            type: true,
            createdBy: true
        }
    });
};

/**
 * Deletes the file and all its references from database and returns it
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - File UUID
 * @returns returns the deleted file
 * @throws {error}
 */
const deleteFile = (prisma, id) => {
    return prisma.file.delete({
        where: { id }
    });
};

module.exports = { deleteFile, getFile };
