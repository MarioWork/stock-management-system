const schema = {};

const options = { schema };

//TODO: Implement this route
module.exports = async server => {
    server.delete('/', options, async (request, reply) => {
        await reply.code(200).send({ message: 'In development...' });
    });
};
