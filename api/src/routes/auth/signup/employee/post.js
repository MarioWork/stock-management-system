const S = require('fluent-json-schema');

const UserSchema = require('../../../../schemas/user-schema');
const { UserRoles } = require('../../../../enums/user-roles');
const { authorize, createUser } = require('../../../../controllers/user-controller');

const schema = {
    headers: S.object().prop('authorization', S.string()).required(['authorization']),
    body: S.object()
        .prop('email', S.string())
        .prop('password', S.string())
        .prop('firstName', S.string())
        .prop('lastName', S.string())
        .prop('nif', S.string().minLength(8))
        .required(['email', 'password', 'firstName', 'lastName', 'nif']),
    response: {
        201: UserSchema
    }
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { authService, prisma, to } = server;
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
                    roles: [UserRoles.EMPLOYEE]
                }
            )
        );

        if (error) {
            if (error.statusCode === 400) {
                await reply.badRequest(error.message);
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(201).send(user);
    });
};
