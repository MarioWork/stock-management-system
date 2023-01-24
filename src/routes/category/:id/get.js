const CategorySchema = require('../../../schemas/category-schema');
const S = require('fluent-json-schema');
const { getCategoryById } = require('../../../controllers/category-controller');

const schema = {
    response: { 200: CategorySchema },
    params: S.object().prop('id', S.number()).required(['id'])
};

const options = {
    schema
};

/**
 * Route to retrieve a category by ID
 * Fastify plugin to behave as
 * @async
 * @param {*} server -  Fastify server instance decorated with prisma
 */
module.exports = async server => {
    const { prisma, to } = server;
    server.get('/', options, async (request, reply) => {
        const [error, category] = await to(getCategoryById(prisma, parseInt(request.params.id)));

        if (!category) {
            await reply.notFound();
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(category);
    });
};
