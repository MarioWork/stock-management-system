const S = require('fluent-json-schema');

const { categorySchema, categoryIdSchema } = require('../../../schemas/category-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { getCategoryById } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    headers,
    response: { 200: categorySchema },
    params: S.object().prop('id', categoryIdSchema).required(['id'])
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

/**
 * Route to retrieve a category by ID
 * Fastify plugin to behave as
 * @async
 * @param {*} server -  Fastify server instance decorated with prisma
 */
module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;
        const [error, category] = await to(getCategoryById(prisma, id));

        if (!category) {
            await reply.notFound(`Category with ID: ${id} was not found`);
            return;
        }

        return error ? toHttpError(error) : category;
    });
};
