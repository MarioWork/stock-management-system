const options = {};

//TODO: Add schema for response
module.exports = async server => {
    const { prisma } = server;

    server.post('/', options, async (request, reply) => {
        if (!request.body || !request?.body?.name) {
            await reply.code(400).send({ error: 'Missing body' });
        }

        const { name } = request.body;

        try {
            const newCategory = await prisma.category.create({
                data: {
                    name
                }
            });

            if (!newCategory) {
                await reply.code(500).send({ error: 'Something went wrong...' });
            }

            await reply.code(201).send({ id: newCategory.id });
        } catch (error) {
            server.log.error(error);
            await reply.code(500).send({ error: 'Something went wrong...' });
        }
    });
};
