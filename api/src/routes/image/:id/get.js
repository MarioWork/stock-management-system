const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { fileIdSchema } = require('../../../schemas/file-schema');

const { downloadFile } = require('../../../controllers/file-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    params: S.object().prop('id', fileIdSchema).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { to, storage, prisma, authService } = server;
    server.get('/', options({ prisma, authService }), async (request, reply) => {
        const { id } = request.params;

        const [error, fileBuffer] = await to(downloadFile({ storage, prisma }, id));

        if (error) {
            if (error.statusCode === 404) {
                await reply.notFound('Image not found');
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        reply.type('image');
        await reply.send(fileBuffer[0]);
    });
};
