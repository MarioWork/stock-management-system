const S = require('fluent-json-schema');

const CategorySchema = require('../../../schemas/category-schema');

const { UserRoles } = require('../../../enums/user-roles');
const { getCategoryById } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    response: { 200: CategorySchema },
    params: S.object().prop('id', S.number()).required(['id'])
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
    const { prisma, to, authService } = server;
    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;
        const [error, category] = await to(getCategoryById(prisma, parseInt(id)));

        if (!category) {
            await reply.notFound(`Category with ID: ${id} was not found`);
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(category);
    });
};
