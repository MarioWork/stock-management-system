const S = require('fluent-json-schema');

const { productSchema, productIdSchema } = require('../../../schemas/product-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize } = require('../../../controllers/user-controller');
const { getProductById } = require('../../../controllers/product-controller');

const schema = {
    headers,
    response: { 200: productSchema },
    params: S.object().prop('id', productIdSchema).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, product] = await to(getProductById(prisma, id));

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
