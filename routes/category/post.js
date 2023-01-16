const { createCategory } = require('../../controllers/category-controller');

const options = {};

//TODO: Add schema for response
module.exports = async server => {
    const { prisma, to } = server;

    server.post('/', options, async (request, reply) => {
        if (!request.body || !request?.body?.name) {
            await reply.code(400).send({ error: 'Missing body' });
        }

        const [error, newCategory] = await to(createCategory(prisma, request.body));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(201).send({ id: newCategory.id });
    });
};
