const S = require('fluent-json-schema');

const { UserRoles } = require('../../../enums/user-roles');

const { fileIdSchema } = require('../../../schemas/file-schema');
const { headers } = require('../../../schemas/headers-schema');

const { deleteFile } = require('../../../controllers/file-controller');
const { authorize } = require('../../../controllers/user-controller');

const schema = {
    headers,
    params: S.object().prop('id', fileIdSchema).required(['id'])
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { to, storage, prisma, authService, toHttpError } = server;

    server.delete('/', options({ prisma, authService }), async request => {
        const { id } = request.params;

        const [error] = await to(deleteFile({ prisma, storage }, id));

        if (error) return toHttpError(error);
    });
};
