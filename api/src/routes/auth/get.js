const S = require('fluent-json-schema');

const { authorize } = require('../../services/authentication/token-service');

const schema = {
    headers: S.object().prop('authorization', S.string()).required(['authorization'])
};

const options = { schema };

module.exports = async server => {
    const { authService, to } = server;

    server.get('/', options, async (request, reply) => {
        const token = request.headers.authorization.split(' ')[1];

        const [error, decodedToken] = await to(authorize(authService, { token }));

        console.log('token -> ', decodedToken);

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ decodedToken });
    });
};
