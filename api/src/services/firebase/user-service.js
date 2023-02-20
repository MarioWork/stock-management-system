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

/**
 * Returns a promise that deletes user by id
 * @param {*} authService - Firebase Authentication Dependency
 * @param {string} id - User ID
 * @returns {Promise}
 * @throws {error}
 */
const deleteUserById = (authService, id) => {
    return authService.deleteUser(id);
};

module.exports = {
    createUser,
    deleteUserById
};
