const S = require('fluent-json-schema');
const categorySchema = require('../../schemas/category-schema');
const { createCategory } = require('../../controllers/category-controller');

const schema = {
    body: S.object().additionalProperties(false).prop('name', S.string().required()),
    response: {
        201: categorySchema
    }
};

const options = { schema };

/**
 * Fastify plugin to behave as
 * Route to create a category
 * @async
 * @param {*} server -  Fastify server instance decorated with prisma
 */
module.exports = async server => {
    const { prisma, to } = server;

    server.post('/', options, async (request, reply) => {
        const [error, newCategory] = await to(createCategory(prisma, request.body));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(201).send(newCategory);
    });
};
