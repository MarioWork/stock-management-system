const S = require('fluent-json-schema');

const {
    productSchema,
    productIdSchema,
    productNameSchema,
    productQuantitySchema,
    productDescriptionSchema,
    productUpcSchema
} = require('../../../schemas/product-schema');
const { supplierIdSchema } = require('../../../schemas/supplier-schema');
const { categoryIdSchema } = require('../../../schemas/category-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { updateProduct } = require('../../../controllers/product-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    headers,
    response: {
        200: productSchema
    },
    params: S.object().prop('id', productIdSchema).required(['id']),
    body: S.object()
        .prop('name', productNameSchema)
        .prop('quantity', productQuantitySchema)
        .prop('description', productDescriptionSchema)
        .prop('upc', productUpcSchema)
        .prop('supplier', supplierIdSchema)
        .prop('categories', S.array().items(categoryIdSchema))
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.patch('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;
        const { name, quantity, categories, upc, description, supplier } = request.body;

        if (!name && !quantity && !categories && !upc && !description && !supplier) {
            await reply.badRequest(
                'Needs at least one property (name, quantity, categories, upc or description)'
            );
            return;
        }

        const [error, updatedProduct] = await to(
            updateProduct(prisma, { id, name, quantity, categories, upc, description, supplier })
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
