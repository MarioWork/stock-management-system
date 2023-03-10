const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { productIdSchema } = require('../../../schemas/product-schema');
const { headers } = require('../../../schemas/headers-schema');

const { authorize } = require('../../../controllers/user-controller');
const { deleteProducts } = require('../../../controllers/product-controller');

const schema = {
    headers,
    params: S.object().prop('id', productIdSchema).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService, toHttpError } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, { count }] = await to(deleteProducts(prisma, [id]));

        if (count === 0) return reply.notFound();

        if (error) return toHttpError(error);
    });
};
