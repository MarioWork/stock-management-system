const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize } = require('../../../controllers/user-controller');
const { deleteProducts } = require('../../../controllers/product-controller');

const schema = {
    response: {
        200: S.object().prop('message', S.string()).required(['message'])
    },
    params: S.object().prop('id', S.number()).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, { count }] = await to(deleteProducts(prisma, [id]));

        if (count === 0) {
            await reply.notFound(`Product with ID: ${id} was not found`);
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.send({ message: 'Delete successfully!' });
    });
};
