/**
 * @typedef { import('../types/prisma-docs-type') } PrismaClient
 */

const { Forbidden, BadRequest } = require('http-errors');

const { createUser: createUserPrisma } = require('../services/prisma/user-service');
const { getUser: getUserPrisma } = require('../services/prisma/user-service');
const { createUser: createUserFirebase } = require('../services/firebase/user-service');

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
            const user = await decodeToken(authService, token);

            if (!user) throw new Forbidden('Invalid authorization token');

            const { roles } = await getUserPrisma(prisma, user.uid);

            const isAuthorized = authorizedRoles.every(role => user.roles.includes(role));

            if (!isAuthorized) throw new Forbidden('Not Authorized');

            request.user = { ...user, roles };
        } catch (error) {
            if (error.code === 'auth/id-token-expired') throw new Forbidden('Expired token');
        }
    };

/**
 * Creates a user in the firebase authentication and adds a record with the role to database
 * @param {{prisma: PrismaClient, authService: *}} obj - Dependencies object
 * @param {{email: string, password: string, name: string, roles: string[]}} obj - user data object
 * @returns {{uid: string, email: string, name: string, roles: string[]}} Obj that represents all user data
 * @throws {error}
 */
const createUser = async ({ prisma, authService }, { email, password, name, roles }) => {
    try {
        const { uid } = await createUserFirebase(authService, { email, password, name });
        //TODO: return user created email and name saved
        const user = await createUserPrisma(prisma, { id: uid, roles });
        return { uid, email, name, roles: user.roles };
    } catch (error) {
        if (error.code === 'auth/invalid-email' || error.code === 'auth/email-already-exists')
            throw new BadRequest(error.message);

        throw error;
    }
};

module.exports = {
    createUser,
    authorize
};
