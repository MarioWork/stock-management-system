const S = require('fluent-json-schema');

const { listAllUsers, authorize } = require('../../../controllers/user-controller');

const UserSchema = require('../../../schemas/user-schema');
const paginationMetadataSchema = require('../../../schemas/pagination-metadata-schema');

const { UserRoles } = require('../../../enums/user-roles');

const schema = {
    response: {
        206: S.object()
            .prop('_metadata', paginationMetadataSchema)
            .prop('data', S.array().items(UserSchema))
            .required(['data'])
    },
    query: S.object()
        .prop('role', S.string().enum(Object.values(UserRoles)))
        .prop('filter', S.string())
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, authService, to } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const role = Object.keys(request.query).length === 0 ? null : request.query.role;
        const filter = request.query.filter;
        const pagination = request.parsePaginationQuery();

        const [error, result] = await to(listAllUsers(prisma, { role, filter, pagination }));

        const [categories, total] = result;

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.withPagination({
            total,
            page: pagination.currentPage,
            data: categories
        });
    });
};
