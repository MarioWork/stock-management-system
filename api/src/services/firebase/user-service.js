//TODO: add docs
const createUser = (authService, { email, password }) => {
    return authService.createUser({
        email,
        password
    });
};

module.exports = {
    createUser
};
