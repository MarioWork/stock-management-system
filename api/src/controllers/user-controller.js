/**
 * @typedef { import('../types/prisma-docs-type') } PrismaClient
 * @typedef { import('../types/user-docs-type') } User
 */

const { Forbidden, BadRequest } = require('http-errors');

const { createUser: createUserPrisma } = require('../services/prisma/user-service');
const { getUserById: getUserByIdPrisma } = require('../services/prisma/user-service');
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
            const { uid } = await decodeToken(authService, token);

            if (!uid) throw new Forbidden('Invalid authorization token');

            const user = await getUserByIdPrisma(prisma, uid);

            if (!user) throw new Forbidden('User not found');

            if (!user?.roles) throw new Forbidden('No roles to validate');

            const isAuthorized = authorizedRoles.every(role => user.roles.includes(role));

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
 * @returns {Promise<User>} Obj that represents all user data
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

module.exports = {
    createUser,
    authorize
};
