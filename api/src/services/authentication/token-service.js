const addUserRole = async (authService, { uid, roles }) => {
    await authService.setCustomUserClaims(uid, { roles });
};

module.exports = {
    addUserRole
};
