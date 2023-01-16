const S = require('fluent-json-schema');
const CategorySchema = require('../../schemas/category-schema');
const { createCategory } = require('../../controllers/category-controller');

const schema = {
    body: S.object().additionalProperties(false).prop('name', S.string().required()),
    response: {
        201: CategorySchema
    }
};

const options = { schema };

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

        await reply.code(201).send(newCategory);
    });
};
