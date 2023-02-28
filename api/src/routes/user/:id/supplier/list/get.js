const S = require('fluent-json-schema');

const { getAllUserSuppliers, authorize } = require('../../../../../controllers/user-controller');

const { supplierSchema } = require('../../../../../schemas/supplier-schema');
const paginationMetadataSchema = require('../../../../../schemas/pagination-metadata-schema');
const { userIdSchema } = require('../../../../../schemas/user-schema');

const { UserRoles } = require('../../../../../enums/user-roles');

const schema = {
    params: S.object().prop('id', userIdSchema).required(['id']),
    response: {
        206: S.object()
            .prop('_metadata', paginationMetadataSchema)
            .prop('data', S.array().items(supplierSchema))
            .required(['data'])
    }
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, authService, to } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const pagination = request.parsePaginationQuery();
        const { id } = request.params;

        const [error, result] = await to(getAllUserSuppliers(prisma, { id, pagination }));

        const [suppliers, total] = result;

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.withPagination({
            total,
            page: pagination.currentPage,
            data: suppliers
        });
    });
};
