const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { supplierIdSchema } = require('../../../schemas/supplier-schema');

const { authorize } = require('../../../controllers/user-controller');
const { deleteSuppliers } = require('../../../controllers/supplier-controller');

const schema = {
    response: {
        200: S.object().prop('message', S.string()).required(['message'])
    },
    params: S.object().prop('id', supplierIdSchema).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, { count }] = await to(deleteSuppliers(prisma, [id]));

        if (count === 0) {
            await reply.notFound(`Supplier with ID: ${id} was not found`);
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
