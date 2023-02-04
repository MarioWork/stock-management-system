const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');
const { authorize, createUser } = require('../../../controllers/user-controller');

const schema = {
    headers: S.object().prop('authorization', S.string()).required(['authorization'])
};

const options = authService => ({
    schema,
    preValidation: authorize(authService, [])
});

module.exports = async server => {
    const { authService, prisma, to } = server;
    server.post('/', options(authService), async (request, reply) => {
        const [error, user] = await to(
            createUser(prisma, { id: request.user?.uid, roles: [UserRoles.CONSUMER] })
        );

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
        }

        await reply.code(201).send(user);
    });
};
