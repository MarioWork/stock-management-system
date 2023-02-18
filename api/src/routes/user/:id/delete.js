const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize, deleteUserById } = require('../../../controllers/user-controller');

const schema = {
    params: S.object().prop('id', S.string()).required(['id']),
    response: { 200: S.object().prop('message', S.string()).required(['message']) }
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, _] = await to(deleteUserById({ prisma, authService }, id));

        if (error) {
            if (error.statusCode === 404) {
                await reply.notFound(error.message);
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.send({ message: 'Delete successfully!' });
    });
};
