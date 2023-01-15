const options = {};

//TODO: Add schema for response
module.exports = async server => {
    const { prisma } = server;

    server.post('/', options, async (request, reply) => {
        if (!request.body || !request?.body?.name) {
            await reply.code(400).send({ error: 'Missing body' });
        }

        const { name } = request.body;

        const [error, newCategory] = await server.to(
            prisma.category.create({
                data: {
                    name
                }
            })
        );

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(201).send({ id: newCategory.id });
    });
};
