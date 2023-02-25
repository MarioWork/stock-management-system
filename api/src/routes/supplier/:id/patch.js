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

const schema = {
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
    const { prisma, to, authService } = server;

    server.patch('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;
        const { name, nif } = request.body;

        if (!name && !nif) {
            await reply.badRequest('Needs at least one property (name or nif)');
            return;
        }

        const [error, updatedSupplier] = await to(updateSupplier(prisma, { id, name, nif }));

        if (error) {
            if (error.statusCode === 404) {
                await reply.notFound(error.message);
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(updatedSupplier);
    });
};
