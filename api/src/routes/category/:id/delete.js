const S = require('fluent-json-schema');
const { deleteCategories } = require('../../../controllers/category-controller');
const { authorize } = require('../../../controllers/user-controller');
const { UserRoles } = require('../../../enums/user-roles');

const schema = {
    response: {
        200: S.object().prop('message', S.string()).required(['message'])
    },
    params: S.object().prop('id', S.string().format('uuid')).required(['id'])
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
    const { prisma, to, authService } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, { count }] = await to(deleteCategories(prisma, id));

        if (count === 0) {
            await reply.notFound(`Category with ID: ${id} was not found`);
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ message: 'Deleted successfully!' });
    });
};
