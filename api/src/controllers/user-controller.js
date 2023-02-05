const { Forbidden, BadRequest } = require('http-errors');

const { createUser: createUserPrisma } = require('../services/prisma/user-service');
const { createUser: createUserFirebase } = require('../services/firebase/user-service');

const decodeToken = async (authService, token) => await authService.verifyIdToken(token);

//TODO: Add docs
const authorize = (authService, roles) => async (request, _) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new Forbidden('Missing authorization token');

    try {
        const user = await decodeToken(authService, token);

        //TODO: check for claims
        if (!user) throw new Forbidden('Invalid authorization token');

        //TODO: Grab roles from prisma
        //const isAuthorized = roles.every(role => !user.claims?.roles.includes(role));
        const isAuthorized = true;

        if (!isAuthorized) throw new Forbidden('Not Authorized');

        request.user = user;
    } catch (error) {
        if (error.code === 'auth/id-token-expired') throw new Forbidden('Expired token');
    }
};

//TODO:Add docs
const createUser = async ({ prisma, authService }, { email, password, name, role }) => {
    try {
        const { uid } = await createUserFirebase(authService, { email, password, name });
        const user = await createUserPrisma(prisma, { id: uid, role });
        return { uid, email, name, role: user.role };
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
