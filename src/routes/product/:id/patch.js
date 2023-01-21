const S = require('fluent-json-schema');

const { updateProduct } = require('../../../controllers/product-controller');
const productSchema = require('../../../schemas/product-schema');

const schema = {
    response: {
        200: productSchema
    },
    params: S.object().prop('id', S.number()).required(['id']),
    body: S.object()
        .prop('name', S.string())
        .prop('quantity', S.number())
        .prop('categories', S.array().items(S.number()))
};

const options = { schema };

module.exports = async server => {
    const { prisma, to } = server;

    server.patch('/', options, async (request, reply) => {
        const { id } = request.params;
        const { name, quantity, categories } = request.body;

        if (!name && !quantity && !categories) {
            await reply.badRequest('Needs at least one property (name, quantity or categories)');
            return;
        }

        const [error, updatedProduct] = await to(
            updateProduct(prisma, { id, name, quantity, categories })
        );

        if (!updatedProduct) {
            await reply.notFound();
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(updatedProduct);
    });
};
