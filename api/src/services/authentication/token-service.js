const authorize = async (authService, { token, roles }) => {
    const decodedToken = await authService.verifyIdToken(token);

    return decodedToken;
};

module.exports = {
    authorize
};
