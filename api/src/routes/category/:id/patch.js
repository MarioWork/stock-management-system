const S = require('fluent-json-schema');

const categorySchema = require('../../../schemas/category-schema');

const { UserRoles } = require('../../../enums/user-roles');
const { updateCategory } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    response: { 200: categorySchema },
    params: S.object().prop('id', S.number()).required(['id']),
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
    const { prisma, to, authService } = server;

    server.patch('/', options({ prisma, authService }), async (request, reply) => {
        const id = parseInt(request.params.id);
        const { name } = request.body;

        const [error, updatedCategory] = await to(updateCategory(prisma, { id, name }));

        if (!updatedCategory) {
            await reply.notFound(`Category with ID: ${id} was not found`);
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(updatedCategory);
    });
};
