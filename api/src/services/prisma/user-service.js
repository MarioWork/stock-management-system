/**
 * @typedef { import('../types/product-docs-type') } PrismaClient
 * @typedef { import('../types/user-docs-type') } User
 */

/**
 * Get a user record from database with its id and role
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - User ID
 * @returns {Promise<{User}>} Promise when resolved returns user
 * @throws {error}
 */
const getUserById = (prisma, id) => {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            nif: true,
            profilePicture: {
                select: {
                    url: true
                }
            },
            email: true,
            roles: true
        }
    });
};

/**
 * Creates a user record on database with its id and role
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - User ID
 * @returns {Promise<{User}>} Promise when resolved returns user
 * @throws {error}
 */
const createUser = (prisma, { id, firstName, lastName, nif, email, roles }) => {
    return prisma.user.create({
        data: {
            id,
            firstName,
            lastName,
            nif,
            email,
            roles: {
                set: roles
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            nif: true,
            profilePicture: {
                select: {
                    url: true
                }
            },
            email: true,
            roles: true
        }
    });
};

module.exports = {
    getUserById,
    createUser
};
