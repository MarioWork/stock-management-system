const S = require('fluent-json-schema');
const { updateCategory } = require('../../../controllers/category-controller');
const categorySchema = require('../../../schemas/category-schema');

const schema = {
    response: { 200: categorySchema },
    params: S.object().prop('id', S.number()).required(['id']),
    body: S.object().additionalProperties(false).prop('name', S.string().required())
};

const options = { schema };

module.exports = async server => {
    const { prisma, to } = server;

    server.patch('/', options, async (request, reply) => {
        const id = parseInt(request.params.id);
        const { name } = request.body;

        const [error, updatedCategory] = await to(updateCategory(prisma, { id, name }));

        if (!updatedCategory) {
            await reply.notFound();
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(updatedCategory);
    });
};
