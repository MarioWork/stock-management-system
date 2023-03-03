const S = require('fluent-json-schema');

const paginationMetadataSchema = require('../../../schemas/pagination-metadata-schema');
const { supplierSchema } = require('../../../schemas/supplier-schema');
const { pageSchema, sizeSchema } = require('../../../schemas/pagination-query-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize } = require('../../../controllers/user-controller');
const { getAllSuppliers } = require('../../../controllers/supplier-controller');

const schema = {
    response: {
        206: S.object()
            .prop('_metadata', paginationMetadataSchema)
            .prop('data', S.array().items(supplierSchema))
            .required(['data'])
    },
    query: S.object().prop('filter', S.string()).prop('page', pageSchema).prop('size', sizeSchema)
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { filter } = request.query;
        const pagination = request.parsePaginationQuery();

        const [error, result] = await to(getAllSuppliers(prisma, { filter, pagination }));

        const [products, total] = result;

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.withPagination({
            total,
            page: pagination.currentPage,
            data: products
        });
    });
};
