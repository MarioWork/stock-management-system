const S = require('fluent-json-schema');

const productSchema = require('../../../schemas/product-schema');
const { getAllProducts } = require('../../../controllers/product-controller');

const schema = {
    response: { 200: S.array().items(productSchema) }
};

const options = { schema };

module.exports = async server => {
    const { prisma, to } = server;

    server.get('/', options, async (request, reply) => {
        const { query } = request.query;

        const [error, products] = await to(getAllProducts(prisma, query));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(products);
    });
};
