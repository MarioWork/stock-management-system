const options = {};

//TODO  schema
module.exports = async server => {
    server.get('/', options, async (request, reply) => {
        const { prisma } = server;

        const [error, categories] = await server.to(prisma.category.findMany());

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ categories: categories });
    });
};
