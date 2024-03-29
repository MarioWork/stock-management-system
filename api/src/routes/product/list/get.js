const S = require('fluent-json-schema');

const { productSchema } = require('../../../schemas/product-schema');
const { categoryIdSchema } = require('../../../schemas/category-schema');
const { supplierIdSchema } = require('../../../schemas/supplier-schema');
const { pageSchema, sizeSchema } = require('../../../schemas/pagination-query-schema');
const paginationMetadataSchema = require('../../../schemas/pagination-metadata-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');
const { Entities } = require('../../../enums/entities');

const { authorize } = require('../../../controllers/user-controller');
const { getAllProducts } = require('../../../controllers/product-controller');

const schema = {
    headers,
    response: {
        206: S.object()
            .prop('_metadata', paginationMetadataSchema)
            .prop('data', S.array().items(productSchema))
            .required(['data'])
    },
    query: S.object()
        .prop('filter', S.string())
        .prop('categoryId', categoryIdSchema)
        .prop('supplierId', supplierIdSchema)
        .prop('page', pageSchema)
        .prop('size', sizeSchema)
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { filter, categoryId, supplierId } = request.query;
        const pagination = request.parsePaginationQuery();
        const sorting = request.parseSortingQuery(Entities.PRODUCT);

        const [error, result] = await to(
            getAllProducts(prisma, { filter, pagination, categoryId, supplierId, sorting })
        );

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
