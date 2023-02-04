const S = require('fluent-json-schema');

const { UserRoles } = require('../../enums/user-roles');
const { authorize } = require('../../controllers/user-controller');

const schema = {
    headers: S.object().prop('authorization', S.string()).required(['authorization'])
};

const options = authService => ({
    schema,
    preValidation: authorize(authService, [UserRoles.ADMIN])
});

module.exports = async server => {
    server.get('/', options(server.authService), async (request, reply) => {
        await reply.code(200).send({ user: request.user });
    });
};
