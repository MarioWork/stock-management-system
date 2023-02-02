const S = require('fluent-json-schema');

const productSchema = require('../../../schemas/product-schema');
const { getProductById } = require('../../../controllers/product-controller');

const schema = {
    response: { 200: productSchema },
    params: S.object().prop('id', S.number()).required(['id'])
};

const options = { schema };

module.exports = async server => {
    const { prisma, to } = server;

    server.get('/', options, async (request, reply) => {
        const { id } = request.params;

        const [error, product] = await to(getProductById(prisma, parseInt(id)));

        if (!product) {
            await reply.notFound(`Product with ID: ${id} was not found`);
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(product);
    });
};
