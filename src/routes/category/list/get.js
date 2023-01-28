const S = require('fluent-json-schema');
const CategorySchema = require('../../../schemas/category-schema');
const { getAllCategories } = require('../../../controllers/category-controller');

const schema = {
    response: { 200: S.array().items(S.oneOf([CategorySchema, S.null()])) }
};

const options = {
    schema
};

/**
 * Fastify plugin to behave as
 * Route to retrieve all categories
 * @async
 * @param {*} server -  Fastify server instance decorated with prisma
 */
module.exports = async server => {
    const { prisma, to } = server;
    server.get('/', options, async (_, reply) => {
        const [error, categories] = await to(getAllCategories(prisma));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
        }

        await reply.code(200).send(categories);
    });
};
