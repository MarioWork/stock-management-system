const S = require('fluent-json-schema');

const { categorySchema, categoryNameSchema } = require('../../schemas/category-schema');
const { headers } = require('../../schemas/headers-schema');

const { UserRoles } = require('../../enums/user-roles');

const { authorize } = require('../../controllers/user-controller');
const { createCategory } = require('../../controllers/category-controller');

const schema = {
    headers,
    body: S.object()
        .additionalProperties(false)
        .prop('name', categoryNameSchema)
        .required(['name']),
    response: {
        201: categorySchema
    }
};

const options = ({ authService, prisma }) => ({
    schema,
    preValidation: authorize({ prisma, authService }, [UserRoles.ADMIN])
});

/**
 * Fastify plugin to behave as
 * Route to create a category
 * @async
 * @param {*} server -  Fastify server instance decorated with prisma
 */
module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;
    server.post('/', options({ prisma, authService }), async (request, reply) => {
        const { name } = request.body;

        const [error, newCategory] = await to(
            createCategory(prisma, { name, createdBy: request.user.id })
        );

        return error ? toHttpError(error) : reply.code(201).send(newCategory);
    });
};
