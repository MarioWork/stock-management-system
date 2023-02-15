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

/**
 * Saves file to the cloud, creates a file record and connects it to the user
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: Number, fileId: String, fileUrl: String, fileType: String }} obj
 * @returns {Promise<User>} - Represents updated user
 * @throws {error}
 */
const addProfilePicture = (prisma, { id, fileId, fileUrl, fileType }) => {
    return prisma.user.update({
        where: { id },
        data: {
            profilePicture: {
                connectOrCreate: {
                    where: { id: fileId },
                    create: {
                        id: fileId,
                        url: fileUrl,
                        type: fileType
                    }
                }
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            nif: true,
            profilePicture: {
                select: { url: true }
            },
            email: true,
            roles: true
        }
    });
};

/**
 * Checks if there is a record of profilePicture for the user
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {Number} id - User Id
 * @returns {Promise<{profilePicture: {{id: String, type: String}}}>} - users picture file metadata
 * @throws {error}
 */
const hasProfilePicture = (prisma, id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            profilePicture: {
                select: { id: true, type: true }
            }
        }
    });
};

/**
 * Retrieves all users with the filter options
 * @param {PrismaClient} prisma
 * @param {{role: String, query: String}} obj
 * @returns {Promise<User[]>}
 */
const listAllUsers = (prisma, { role, query }) => {
    const mutated = query ?? '';
    const textQueries = {
        OR: [
            { email: { contains: mutated, mode: 'insensitive' } },
            { nif: { contains: mutated, mode: 'insensitive' } },
            { firstName: { contains: mutated, mode: 'insensitive' } },
            { lastName: { contains: mutated, mode: 'insensitive' } }
        ]
    };

    const whereQuery = !role ? textQueries : { ...textQueries, AND: { roles: { has: role } } };

    return prisma.user.findMany({
        where: whereQuery,
        select: {
            id: true,
            email: true,
            nif: true,
            firstName: true,
            lastName: true,
            roles: true,
            profilePicture: {
                select: {
                    url: true
                }
            },
            createdAt: true,
            updatedAt: true
        }
    });
};

module.exports = {
    getUserById,
    createUser,
    addProfilePicture,
    hasProfilePicture,
    listAllUsers
};
