const S = require('fluent-json-schema');

const { deleteProducts } = require('../../../controllers/product-controller');

const schema = {
    response: {
        200: S.object().prop('message', S.string()).required(['message'])
    },
    params: S.object().prop('id', S.number()).required(['id'])
};

const options = { schema };

module.exports = async server => {
    const { prisma, to } = server;

    server.delete('/', options, async (request, reply) => {
        const { id } = request.params;

        const [error, { count }] = await to(deleteProducts(prisma, [id]));

        if (count === 0) {
            await reply.notFound(`Product with ID: ${id} was not found`);
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
        }

        await reply.code(200).send({ message: 'Delete successfully!' });
    });
};
