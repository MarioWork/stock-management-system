const S = require('fluent-json-schema');

const { getAllUserProducts, authorize } = require('../../../../../controllers/user-controller');

const { productSchema } = require('../../../../../schemas/product-schema');
const paginationMetadataSchema = require('../../../../../schemas/pagination-metadata-schema');
const { userIdSchema } = require('../../../../../schemas/user-schema');
const { headers } = require('../../../../../schemas/headers-schema');

const { UserRoles } = require('../../../../../enums/user-roles');
const { Entities } = require('../../../../../enums/entities');

const schema = {
    headers,
    params: S.object().prop('id', userIdSchema).required(['id']),
    response: {
        206: S.object()
            .prop('_metadata', paginationMetadataSchema)
            .prop('data', S.array().items(productSchema))
            .required(['data'])
    }
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, authService, to, toHttpError } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const pagination = request.parsePaginationQuery();
        const sorting = request.parseSortingQuery(Entities.PRODUCT);
        const { id } = request.params;

        const [error, result] = await to(getAllUserProducts(prisma, { id, pagination, sorting }));

        const [products, total] = result;

        return error
            ? toHttpError(error)
            : reply.withPagination({
                  total,
                  page: pagination.currentPage,
                  data: products
              });
    });
};
