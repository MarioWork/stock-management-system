const S = require('fluent-json-schema');

const { authorize } = require('../../../controllers/user-controller');
const { UserRoles } = require('../../../enums/user-roles');

const { AllowedFileType } = require('../../../enums/allowed-file-type');
const { addProfilePicture } = require('../../../controllers/user-controller');

const schema = {
    response: {
        200: S.object()
    }
};
const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ prisma, authService }, [UserRoles.ADMIN, UserRoles.EMPLOYEE])
});

module.exports = async server => {
    const { prisma, storage, to, authService } = server;

    server.post('/', options({ prisma, authService }), async (request, reply) => {
        const { mimetype, filename, file } = await request.file();
        const fileType = mimetype.split('/')[1]?.toLowerCase();

        //If there is not file content
        if (filename === '') {
            await reply.badRequest('Missing file content');
            return;
        }

        //If the file type is not allowed
        if (!Object.values(AllowedFileType).includes(fileType)) {
            await reply.badRequest('File type not allowed');
            return;
        }

        const [error, user] = await to(
            addProfilePicture({ prisma, storage }, { userId: request.user?.id, file, fileType })
        );

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(user);
    });
};
