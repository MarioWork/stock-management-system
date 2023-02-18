const S = require('fluent-json-schema');

const CategorySchema = require('../../../schemas/category-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { getAllCategories } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    response: { 200: S.array().items(S.oneOf([CategorySchema, S.null()])) }
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
//TODO: apply pagination
module.exports = async server => {
    const { prisma, to, authService } = server;
    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const pagination = request.parsePaginationQuery();

        const [error, result] = await to(getAllCategories(prisma, pagination));
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
