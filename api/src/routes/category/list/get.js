const S = require('fluent-json-schema');

const { categorySchema } = require('../../../schemas/category-schema');
const { pageSchema, sizeSchema } = require('../../../schemas/pagination-query-schema');
const { headers } = require('../../../schemas/headers-schema');
const paginationMetadataSchema = require('../../../schemas/pagination-metadata-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { getAllCategories } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    headers,
    query: S.object().prop('page', pageSchema).prop('size', sizeSchema),
    response: {
        206: S.object()
            .prop('_metadata', paginationMetadataSchema)
            .prop('data', S.array().items(categorySchema))
            .required(['data'])
    }
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});
/**
 * Fastify plugin to behave as
 * Route to retrieve all categories
 * @async
 * @param {*} server -  Fastify server instance decorated with prisma
 */
module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;
    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const pagination = request.parsePaginationQuery();

        const [error, result] = await to(getAllCategories(prisma, pagination));
        const [categories, total] = result;

        return error
            ? toHttpError(error)
            : reply.withPagination({
                  total,
                  page: pagination.currentPage,
                  data: categories
              });
    });
};
