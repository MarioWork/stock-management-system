const options = {};

//TODO  schema
module.exports = async server => {
    server.get('/', options, async (request, reply) => {
        const { prisma } = server;

        try {
            const categories = await prisma.category.findMany();

            await reply.code(200).send({ categories: categories });
        } catch (error) {
            server.log.error(error);
            await reply.code(500).send({ error: 'Something went wrong...' });
        }
    });
};
