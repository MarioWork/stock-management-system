const S = require('fluent-json-schema');

const productSchema = require('../../../schemas/product-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { authorize } = require('../../../controllers/user-controller');
const { getAllProducts } = require('../../../controllers/product-controller');

const schema = {
    response: { 200: S.array().items(productSchema) },
    query: S.object().prop('filter', S.string())
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, to, authService } = server;

    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { filter } = request.query;
        const pagination = request.parsePaginationQuery();

        const [error, products] = await to(getAllProducts(prisma, { filter, pagination }));

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(products);
    });
};
