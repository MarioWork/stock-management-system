const S = require('fluent-json-schema');

const { userSchema, userIdSchema } = require('../../../schemas/user-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize, getUserById } = require('../../../controllers/user-controller');

const schema = {
    response: { 200: userSchema },
    params: S.object().prop('id', userIdSchema).required(['id'])
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN, UserRoles.EMPLOYEE])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, user] = await to(getUserById(prisma, id));

        if (!user) {
            await reply.notFound(`User with ID: ${id} was not found`);
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.send(user);
    });
};
