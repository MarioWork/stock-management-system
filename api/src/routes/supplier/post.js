const S = require('fluent-json-schema');

const { UserRoles } = require('../../enums/user-roles');

const {
    supplierNifSchema,
    supplierNameSchema,
    supplierSchema
} = require('../../schemas/supplier-schema');
const { headers } = require('../../schemas/headers-schema');

const { authorize } = require('../../controllers/user-controller');
const { createSupplier } = require('../../controllers/supplier-controller');

const schema = {
    headers,
    body: S.object()
        .additionalProperties(false)
        .prop('name', supplierNameSchema)
        .prop('nif', supplierNifSchema)
        .required(['name', 'nif']),
    response: {
        201: supplierSchema
    }
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.post('/', options({ prisma, authService }), async (request, reply) => {
        const { name, nif } = request.body;

        const [error, supplier] = await to(
            createSupplier(prisma, {
                name,
                nif,
                createdBy: request.user.id
            })
        );

        return error ? toHttpError(error) : reply.code(201).send(supplier);
    });
};
