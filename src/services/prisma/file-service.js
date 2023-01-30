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

//TODO: Add docs
const deleteFile = (prisma, id) => {
    return prisma.file.delete({
        where: { id }
    });
};

module.exports = { deleteFile, getFile };
