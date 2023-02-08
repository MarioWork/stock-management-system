const { authorize } = require('../../../controllers/user-controller');
const { UserRoles } = require('../../../enums/user-roles');

const schema = {};
const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ prisma, authService }, [UserRoles.ADMIN, UserRoles.EMPLOYEE])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.post(
        '/',
        options({ prisma, authService }, async (request, reply) => {
            await reply.send();
        })
    );
};
