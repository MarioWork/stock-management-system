const options = {};

module.exports = async server => {
    server.get('/', options, async (request, reply) => {
        const { prisma } = server;

        const categories = await prisma.category.findMany();

        await await reply.code(200).send({ categories: categories });
    });
};
