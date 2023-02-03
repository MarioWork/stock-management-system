const { Forbidden } = require('http-errors');

const { addUserRole: addUserRoleService } = require('../services/authentication/token-service');

const decodeToken = async (authService, token) => await authService.verifyIdToken(token);

//TODO: Add docs
const authorize = (authService, roles) => async (request, _, done) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new Forbidden('Missing authorization token');

    try {
        const user = await decodeToken(authService, token);

        //TODO: check for claims
        if (!user) throw new Forbidden('Invalid authorization token');

        //const isAuthorized = roles.every(role => !user.claims?.roles.includes(role));
        const isAuthorized = true;

        if (!isAuthorized) throw new Forbidden('Not Authorized');

        request.user = user;
    } catch (error) {
        if (error.code === 'auth/id-token-expired') throw new Forbidden('Expired token');
    }

    done();
};

const addUserRole = (authService, { token, roles }) => {
    const { uid } = decodeToken(authService, token);

    if (!uid) throw 403;

    addUserRoleService(authService, { uid, roles });
};

module.exports = {
    addUserRole,
    authorize
};
