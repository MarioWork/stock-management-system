const createUser = (authService, { email, password, name }) => {
    return authService.createUser({
        email,
        displayName: name,
        password
    });
};

module.exports = {
    createUser
};
