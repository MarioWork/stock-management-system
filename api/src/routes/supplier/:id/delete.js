const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { supplierIdSchema } = require('../../../schemas/supplier-schema');
const { headers } = require('../../../schemas/headers-schema');

const { authorize } = require('../../../controllers/user-controller');
const { deleteSuppliers } = require('../../../controllers/supplier-controller');

const schema = {
    headers,
    params: S.object().prop('id', supplierIdSchema).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, { count }] = await to(deleteSuppliers(prisma, [id]));

        if (count === 0) return reply.notFound();

        if (error) return toHttpError(error);
    });
};
