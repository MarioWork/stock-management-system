const S = require('fluent-json-schema');

const { listAllUsers, authorize } = require('../../../controllers/user-controller');

const { userSchema } = require('../../../schemas/user-schema');
const { pageSchema, sizeSchema } = require('../../../schemas/pagination-query-schema');
const paginationMetadataSchema = require('../../../schemas/pagination-metadata-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const schema = {
    headers,
    response: {
        206: S.object()
            .prop('_metadata', paginationMetadataSchema)
            .prop('data', S.array().items(userSchema))
            .required(['data'])
    },
    query: S.object()
        .prop('role', S.string().enum(Object.values(UserRoles)))
        .prop('filter', S.string())
        .prop('page', pageSchema)
        .prop('size', sizeSchema)
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, authService, to, toHttpError } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const role = Object.keys(request.query).length === 0 ? null : request.query.role;
        const filter = request.query.filter;
        const pagination = request.parsePaginationQuery();
        const sorting = request.parseSortingQuery(['name']);

        console.log(sorting);
        const [error, result] = await to(listAllUsers(prisma, { role, filter, pagination }));

        const [users, total] = result;

        return error
            ? toHttpError(error)
            : reply.withPagination({
                  total,
                  page: pagination.currentPage,
                  data: users
              });
    });
};
