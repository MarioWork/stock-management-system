const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { deleteFile } = require('../../../controllers/file-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    params: S.object().prop('id', S.string()).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { to, storage, prisma, authService } = server;

    server.delete('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error] = await to(deleteFile({ prisma, storage }, id));

        if (error) {
            if (error.statusCode === 404) {
                await reply.notFound(error.message);
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ message: 'Delete successfully!' });
    });
};
