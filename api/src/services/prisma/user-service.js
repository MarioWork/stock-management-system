/**
 * @typedef { import('../types/product-docs-type') } PrismaClient
 */

/**
 * Creates a user record on database with its id and role
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - User ID
 * @returns {Promise<{id: string, roles: string}>} Promise when resolved returns user
 * @throws {error}
 */
const getUser = (prisma, id) => {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            roles: true
        }
    });
};

//TODO: Add docs
const createUser = (prisma, { id, role }) => {
    return prisma.user.create({
        data: {
            id,
            role
        },
        select: {
            id: true,
            role: true
        }
    });
};

module.exports = {
    getUser,
    createUser
};
