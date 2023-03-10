const S = require('fluent-json-schema');

const { userSchema, userIdSchema } = require('../../../schemas/user-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize, getUserById } = require('../../../controllers/user-controller');

const schema = {
    headers,
    response: { 200: userSchema },
    params: S.object().prop('id', userIdSchema).required(['id'])
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN, UserRoles.EMPLOYEE])
});

module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, user] = await to(getUserById(prisma, id));

        if (!user) return reply.notFound();

        return error ? toHttpError(error) : user;
    });
};
