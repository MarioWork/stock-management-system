const S = require('fluent-json-schema');

const {
    productSchema,
    productQuantitySchema,
    productDescriptionSchema,
    productUpcSchema
} = require('../../schemas/product-schema');
const { headers } = require('../../schemas/headers-schema');

const { categoryIdSchema } = require('../../schemas/category-schema');
const { supplierIdSchema } = require('../../schemas/supplier-schema');

const { UserRoles } = require('../../enums/user-roles');

const { authorize } = require('../../controllers/user-controller');
const { createProduct } = require('../../controllers/product-controller');

const schema = {
    headers,
    body: S.object()
        .additionalProperties(false)
        .prop('name')
        .prop('description', productDescriptionSchema)
        .prop('upc', productUpcSchema)
        .prop('quantity', productQuantitySchema)
        .prop('categories', S.array().items(categoryIdSchema))
        .prop('supplier', supplierIdSchema)
        .required(['name', 'supplier', 'upc']),
    response: {
        201: productSchema
    }
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.post('/', options({ prisma, authService }), async (request, reply) => {
        const { name, quantity, categories, supplier, description, upc } = request.body;

        const [error, product] = await to(
            createProduct(prisma, {
                name,
                quantity,
                categories,
                supplier,
                description,
                upc,
                createdBy: request.user.id
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
