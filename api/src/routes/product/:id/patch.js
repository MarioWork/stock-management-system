const S = require('fluent-json-schema');

const productSchema = require('../../../schemas/product-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { updateProduct } = require('../../../controllers/product-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    response: {
        200: productSchema
    },
    params: S.object().prop('id', S.string().format('uuid')).required(['id']),
    body: S.object()
        .prop('name', S.string())
        .prop('quantity', S.number())
        .prop('categories', S.array().items(S.number()))
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.patch('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;
        const { name, quantity, categories } = request.body;

        if (!name && !quantity && !categories) {
            await reply.badRequest('Needs at least one property (name, quantity or categories)');
            return;
        }

        const [error, updatedProduct] = await to(
            updateProduct(prisma, { id, name, quantity, categories })
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

        await reply.code(200).send(updatedProduct);
    });
};
