const { authorize } = require('../../services/authentication/token-service');

const options = {};

module.exports = async server => {
    const { authService, to } = server;

    server.get('/', options, async (request, reply) => {
        const { token } = request.body;

        const [error, decodedToken] = await to(authorize(authService, { token }));

        console.log('token -> ', token);

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ decodedToken });
    });
};
