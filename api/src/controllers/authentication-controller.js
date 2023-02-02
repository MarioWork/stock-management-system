const { addUserRole: addUserRoleService } = require('../services/authentication/token-service');

const decodeToken = async (authService, token) => await authService.verifyIdToken(token);

//TODO: Add docs
//TODO: ADd better errors
const authorize = (authService, roles) => async (request, _, done) => {
    const token = request.headers.authorization.split(' ')[1];

    if (!token) throw 403;

    const user = await decodeToken(authService, token);

    //TODO: check for claims
    if (!user) throw 403;

    //const isAuthorized = roles.every(role => !user.claims?.roles.includes(role));
    const isAuthorized = true;

    if (!isAuthorized) throw 403;

    request.user = user;

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
