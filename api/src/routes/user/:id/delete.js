const S = require('fluent-json-schema');

const { userIdSchema } = require('../../../schemas/user-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize, deleteUserById } = require('../../../controllers/user-controller');

const schema = {
    headers,
    params: S.object().prop('id', userIdSchema).required(['id'])
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error] = await to(deleteUserById({ prisma, authService }, id));

        if (error) {
            if (error.statusCode === 404) {
                await reply.notFound(error.message);
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        return {};
    });
};
