const S = require('fluent-json-schema');

const { deleteCategories } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');

const { categoryIdSchema } = require('../../../schemas/category-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const schema = {
    headers,
    params: S.object().prop('id', categoryIdSchema).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

/**
 * Route to delete a category
 * Fastify plugin to behave as
 * @async
 * @param {*} server -  Fastify server instance decorated with prisma
 */
module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, { count }] = await to(deleteCategories(prisma, id));

        if (count === 0) return reply.notFound();

        if (error) return toHttpError(error);
    });
};
