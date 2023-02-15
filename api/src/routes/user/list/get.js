const S = require('fluent-json-schema');

const { listAllUsers, authorize } = require('../../../controllers/user-controller');

const UserSchema = require('../../../schemas/user-schema');

const { UserRoles } = require('../../../enums/user-roles');

const schema = {
    response: { 200: S.array().items(UserSchema) },
    role: S.object()
        .prop('role', S.string().enum(Object.values(UserRoles)))
        .prop('query', S.string())
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, authService, to } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const role = Object.keys(request.query).length === 0 ? null : request.query.role;
        const query = request.query.query;
        const [error, users] = await to(listAllUsers(prisma, { role, query }));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(users);
    });
};