const S = require('fluent-json-schema');

const UserSchema = require('../../../../schemas/user-schema');
const { UserRoles } = require('../../../../enums/user-roles');
const { authorize, createUser } = require('../../../../controllers/user-controller');

const schema = {
    headers: S.object().prop('authorization', S.string()).required(['authorization']),
    body: S.object()
        .prop('email', S.string())
        .prop('password', S.string())
        .prop('name', S.string())
        .required(['email', 'password', 'name']),
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
        const { email, password, name } = request.body;

        const [error, user] = await to(
            createUser(
                { prisma, authService },
                {
                    email,
                    password,
                    name,
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
