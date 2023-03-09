const S = require('fluent-json-schema');

const {
    userSchema,
    userEmailSchema,
    userPasswordSchema,
    userFirstNameSchema,
    userLastNameSchema,
    userNifSchema
} = require('../../../../schemas/user-schema');

const { headers } = require('../../../../schemas/headers-schema');

const { UserRoles } = require('../../../../enums/user-roles');

const { authorize, createUser } = require('../../../../controllers/user-controller');

const schema = {
    headers,
    body: S.object()
        .prop('email', userEmailSchema)
        .prop('password', userPasswordSchema)
        .prop('firstName', userFirstNameSchema)
        .prop('lastName', userLastNameSchema)
        .prop('nif', userNifSchema)
        .required(['email', 'password', 'firstName', 'lastName', 'nif']),
    response: {
        201: userSchema
    }
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { authService, prisma, to, toHttpError } = server;

    server.post('/', options({ authService, prisma }), async (request, reply) => {
        const { firstName, lastName, nif, email, password } = request.body;

        const [error, user] = await to(
            createUser(
                { prisma, authService },
                {
                    firstName,
                    lastName,
                    nif,
                    email,
                    password,
                    roles: [UserRoles.EMPLOYEE],
                    createdBy: request.user.id
                }
            )
        );

        return error ? toHttpError(error) : reply.code(201).send(user);
    });
};
