const S = require('fluent-json-schema');

const productSchema = require('../../../schemas/category-schema');
const { getAllProducts } = require('../../../controllers/product-controller');

const schema = {
    response: { 200: S.array().items(S.oneOf([productSchema, S.null()])) }
};

const options = { schema };

module.exports = async server => {
    const { prisma, to } = server;

    server.get('/', options, async (request, reply) => {
        const [error, products] = await to(getAllProducts(prisma));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(products);
    });
};
