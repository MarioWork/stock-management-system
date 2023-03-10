const S = require('fluent-json-schema');

const { getUserRoles, authorize } = require('../../../../controllers/user-controller');

const { userRolesSchema, userIdSchema } = require('../../../../schemas/user-schema');
const { headers } = require('../../../../schemas/headers-schema');

const { UserRoles } = require('../../../../enums/user-roles');

const schema = {
    headers,
    params: S.object().prop('id', userIdSchema).required(['id']),
    response: {
        200: S.object()
            .prop('id', userIdSchema)
            .prop('roles', userRolesSchema)
            .required(['id', 'roles'])
    }
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN, UserRoles.EMPLOYEE])
});

module.exports = async server => {
    const { prisma, authService, to, toHttpError } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, user] = await to(getUserRoles(prisma, id));

        if (!user) return reply.notFound();

        return error ? toHttpError(error) : user;
    });
};
