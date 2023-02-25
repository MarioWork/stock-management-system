/**
 * @typedef { import('../types/prisma-docs-type') } PrismaClient
 * @typedef { import('../types/user-docs-type') } User
 */

const { Forbidden, BadRequest, NotFound } = require('http-errors');

const {
    getUserById: getUserByIdPrisma,
    createUser: createUserPrisma,
    addProfilePicture: addProfilePicturePrisma,
    listAllUsers: listAllUsersPrisma,
    deleteUserById: deleteUserByIdPrisma,
    hasProfilePicture
} = require('../services/prisma/user-service');

const { deleteFile: deleteFilePrisma } = require('../services/prisma/file-service');

const {
    createUser: createUserFirebase,
    deleteUserById: deleteUserByIdFirebase
} = require('../services/firebase/user-service');

const { saveFile, deleteFile } = require('../services/cloud-storage/cloud-file-service');

const decodeToken = async (authService, token) => await authService.verifyIdToken(token);

/**
 * Checks if the user is authorized to make the request
 * Decorates request with user after authorization
 * @param {*} authService - Firebase auth service
 * @param {String[]} authorizedRoles - Roles that are authorized
 * @throws {error}
 */
const authorize =
    ({ authService, prisma }, authorizedRoles) =>
    async request => {
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) throw new Forbidden('Missing authorization token');

        try {
            const { uid } = await decodeToken(authService, token);

            if (!uid) throw new Forbidden('Invalid authorization token');

            const user = await getUserByIdPrisma(prisma, uid);

            if (!user) throw new Forbidden('User not found');

            if (!user?.roles) throw new Forbidden('No roles to validate');

            const isAuthorized = user.roles.every(role => authorizedRoles.includes(role));

            if (!isAuthorized) throw new Forbidden('Not Authorized');

            request.user = user;
        } catch (error) {
            if (error.statusCode === 403) throw new Forbidden(error.message);
            if (error.code === 'auth/id-token-expired') throw new Forbidden('Expired token');
        }
    };

/**
 * Creates a user in the firebase authentication and adds a record with the role to database
 * @param {{prisma: PrismaClient, authService: *}} obj - Dependencies object
 * @param {{
 *  firstName: string,
 *  lastName: string,
 *  nif: string,
 *  email: string,
 *  password: string,
 *  name: string,
 * roles: string[]
 * }} obj - user data object
 * @returns {User} Obj that represents all user data
 * @throws {error}
 */
const createUser = async (
    { prisma, authService },
    { firstName, lastName, password, nif, email, roles }
) => {
    try {
        const { uid } = await createUserFirebase(authService, { email, password });

        const user = await createUserPrisma(prisma, {
            id: uid,
            firstName,
            lastName,
            nif,
            email,
            roles
        });

        return user;
    } catch (error) {
        if (error.code === 'P2002') throw new BadRequest(`${error.meta.target[0]} already exists`);
        if (error.code === 'auth/invalid-email' || error.code === 'auth/email-already-exists')
            throw new BadRequest(error.message);

        throw error;
    }
};

/**
 * Saves the picture into cloud storage and connects it to user.
 * If there is already a profile picture reference it deletes the file and adds the new one
 * @param {{prisma: PrismaClient, storage: *}} obj - Object that represents dependencies
 * @param {{userId: string, file: FileStream, fileType: string}} obj  - Object with data
 * @returns
 */
const addProfilePicture = async ({ prisma, storage }, { userId, file, fileType }) => {
    const user = await hasProfilePicture(prisma, userId);

    //Delete user picture/file if there is one already
    if (user?.profilePicture?.id)
        await Promise.all([
            deleteFilePrisma(prisma, user.profilePicture.id),
            deleteFile(storage, { id: user.profilePicture.id, type: user.profilePicture.type })
        ]);

    const { fileUrl, fileId } = await saveFile(storage, { file: file, type: fileType });

    try {
        return await addProfilePicturePrisma(prisma, {
            id: userId,
            fileId,
            fileUrl,
            fileType
        });
    } catch (error) {
        await deleteFile(storage, { id: fileId, type: fileType });
        throw error;
    }
};

/**
 * Retrieves all users with the filter options
 * @param {PrismaClient} prisma
 * @param {{role: String, filter: String}} obj
 * @returns {Promise<{}[]>} - Returns a Promise when resolved returns array with users and users total count
 */
const listAllUsers = (prisma, { role, filter, pagination }) =>
    listAllUsersPrisma(prisma, { role, filter, pagination });

/**
 * Get a user record from database with its id and role
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - User ID
 * @returns {Promise<{User}>} Promise when resolved returns user
 * @throws {error}
 */
const getUserById = (prisma, id) => getUserByIdPrisma(prisma, id);

/**
 * Deletes a user by id from firebase authentication and database
 * @param {{prisma: PrismaClient, authService: *}} Dependencies
 * @param {string} id
 * @returns {Promise}
 * @throws {error}
 */
const deleteUserById = async ({ prisma, authService }, id) => {
    try {
        return await Promise.all([
            deleteUserByIdPrisma(prisma, id),
            deleteUserByIdFirebase(authService, id)
        ]);
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'P2025')
            throw new NotFound(`User with ID: ${id} was not found`);

        throw error;
    }
};

module.exports = {
    createUser,
    authorize,
    addProfilePicture,
    listAllUsers,
    getUserById,
    deleteUserById
};
