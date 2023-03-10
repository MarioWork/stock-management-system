const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { updateSupplier } = require('../../../controllers/supplier-controller');
const { authorize } = require('../../../controllers/user-controller');
const {
    supplierSchema,
    supplierIdSchema,
    supplierNameSchema,
    supplierNifSchema
} = require('../../../schemas/supplier-schema');
const { headers } = require('../../../schemas/headers-schema');

const schema = {
    headers,
    response: {
        200: supplierSchema
    },
    params: S.object().prop('id', supplierIdSchema).required(['id']),
    body: S.object().prop('name', supplierNameSchema).prop('nif', supplierNifSchema)
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.patch('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;
        const { name, nif } = request.body;

        if (!name && !nif) return reply.badRequest('Needs at least one property (name or nif)');

        const [error, updatedSupplier] = await to(updateSupplier(prisma, { id, name, nif }));

        return error ? toHttpError(error) : updatedSupplier;
    });
};
