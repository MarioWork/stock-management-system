/**
 * Signs up a user in the firebase authentication service
 * @param {*} authService - Firebase auth service
 * @param {{email: string, password: string}} object - Object with user email and password
 * @returns {Promise<{{uid:string, email: string}}>}
 */
const createUser = (authService, { email, password }) => {
    return authService.createUser({
        email,
        password
    });
};

module.exports = {
    createUser
};
