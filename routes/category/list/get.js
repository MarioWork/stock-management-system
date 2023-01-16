const { getAllCategories } = require('../../../controllers/category-controller');

const options = {};

//TODO  schema
module.exports = async server => {
    const { prisma, to } = server;
    server.get('/', options, async (_, reply) => {
        const [error, categories] = await to(getAllCategories(prisma));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ categories: categories });
    });
};
