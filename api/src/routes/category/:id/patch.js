const S = require('fluent-json-schema');

const { categorySchema, categoryIdSchema } = require('../../../schemas/category-schema');
const { headers } = require('../../../schemas/headers-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { updateCategory } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    headers,
    response: { 200: categorySchema },
    params: S.object().prop('id', categoryIdSchema).required(['id']),
    body: S.object().additionalProperties(false).prop('name', S.string().required())
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

/**
 * Route to update a user by ID
 * Fastify plugin to behave as
 * @async
 * @param {*} server -  Fastify server instance
 */
module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.patch('/', options({ prisma, authService }), async (request, reply) => {
        const id = request.params.id;
        const { name } = request.body;

        const [error, updatedCategory] = await to(updateCategory(prisma, { id, name }));

        if (!updatedCategory) {
            await reply.notFound(`Category with ID: ${id} was not found`);
            return;
        }

        return error ? toHttpError(error) : updatedCategory;
    });
};
