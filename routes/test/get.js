module.exports = async server => {
    server.get('/', {}, async (request, reply) => {
        await reply.send({ message: 'hello world' });
    });
};
