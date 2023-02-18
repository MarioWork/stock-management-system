/**
 * @typedef { import('../types/product-docs-type') } PrismaClient
 * @typedef { import('../types/user-docs-type') } User
 */

const selectQuery = {
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
};

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
        select: selectQuery
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
        select: selectQuery
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
        select: selectQuery
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
                select: {
                    url: true
                }
            }
        }
    });
};

/**
 * Retrieves all users with the filter options
 * @param {PrismaClient} prisma
 * @param {{role: String, filter: String}} obj
 * @returns {Promise<User[]>}
 */
//TODO: fix docs
const listAllUsers = (prisma, { role, filter, pagination }) => {
    const mutatedFilter = filter ?? '';
    const textQueries = {
        OR: [
            { email: { contains: mutatedFilter, mode: 'insensitive' } },
            { nif: { contains: mutatedFilter, mode: 'insensitive' } },
            { firstName: { contains: mutatedFilter, mode: 'insensitive' } },
            { lastName: { contains: mutatedFilter, mode: 'insensitive' } }
        ]
    };

    const whereQuery = !role ? textQueries : { ...textQueries, AND: { roles: { has: role } } };

    return Promise.all([
        prisma.user.findMany({
            where: whereQuery,
            skip: pagination.pastRecordsCount,
            take: pagination.pageSize,
            select: selectQuery
        }),
        prisma.user.count({ where: whereQuery })
    ]);
};

//TODO: add docs
const deleteUserById = (prisma, id) => prisma.user.delete({ where: { id } });

module.exports = {
    getUserById,
    createUser,
    addProfilePicture,
    hasProfilePicture,
    listAllUsers,
    deleteUserById
};
