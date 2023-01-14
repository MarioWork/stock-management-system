const S = require('fluent-json-schema');

const options = {
    schema: {
        response: {
            200: S.object().prop('message', S.string()).required()
        }
    }
};

module.exports = async server => {
    server.get('/', options, async (request, reply) => {
        await reply.send({ message: 'hello world' });
    });
};
