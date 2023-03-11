/**
 * @typedef { import("../../types/prisma-docs-type") } PrismaClient
 */

/**
 * Creates a record of a file in the database
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: string, url: string, type: string, userId: string}} data
 */
const createFile = (prisma, { id, url, type, userId }) =>
    prisma.file.create({ data: { id, url, type, createdByUserId: userId } });

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
            createdByUser: {
                select: {
                    id: true,
                    nif: true,
                    profilePicture: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    roles: true
                }
            }
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

module.exports = { deleteFile, getFile, createFile };
