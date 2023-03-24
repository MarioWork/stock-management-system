const S = require('fluent-json-schema');

const { authorize, updateUser } = require('../../../controllers/user-controller');

const {
    userIdSchema,
    userNifSchema,
    userFirstNameSchema,
    userLastNameSchema,
    userSchema
} = require('../../../schemas/user-schema');
const { headers } = require('../../../schemas/headers-schema');

const schema = {
    headers,
    response: {
        200: userSchema
    },
    params: S.object().prop('id', userIdSchema).required(['id']),
    body: S.object()
        .prop('firstName', userFirstNameSchema)
        .prop('lastName', userLastNameSchema)
        .prop('nif', userNifSchema)
};

const options = ({ authService, prisma }) => ({
    preValidation: authorize({ authService, prisma }),
    schema
});

module.exports = async server => {
    const { authService, prisma, toHttpError, to } = server;

    server.patch('/', options({ authService, prisma }), async (request, reply) => {
        const { id } = request.params;
        const { firstName, lastName, nif } = request.query;

        if (!firstName && !lastName && !nif)
            return reply.badRequest('Needs at least one property (firstName, lastName, nif)');

        const [error, updatedUser] = await to(updateUser(prisma, { id, firstName, lastName, nif }));

        return error ? toHttpError(error) : updatedUser;
    });
};
