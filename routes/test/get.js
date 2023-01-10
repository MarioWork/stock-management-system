const S = require('fluent-json-schema');

module.exports = async server => {
    server.get('/', options, async (request, reply) => {
        await reply.send({ message: 'hello world' });
    });
};

const options = {
    schema: {
        response: {
            200: S.object().prop('message', S.string()).required()
        }
    }
};
