const S = require('fluent-json-schema');

const productSchema = require('../../schemas/product-schema');
const { createProduct } = require('../../controllers/product-controller');

const schema = {
    body: S.object()
        .additionalProperties(false)
        .prop('name', S.string().required())
        .prop('quantity', S.number())
        .prop('categories', S.array().items(S.number())),
    response: {
        201: productSchema
    }
};

const options = { schema };

module.exports = async server => {
    const { prisma, to } = server;

    server.post('/', options, async (request, reply) => {
        const { name, quantity, categories } = request.body;

        const [error, product] = await to(
            createProduct(prisma, {
                name,
                quantity,
                categories
            })
        );

        if (error) {
            if (error.statusCode === 404) {
                await reply.notFound(error.message);
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(201).send(product);
    });
};
