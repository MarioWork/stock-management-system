const S = require('fluent-json-schema');

const { productSchema, productIdSchema } = require('../../../../schemas/product-schema');
const { headers } = require('../../../../schemas/headers-schema');

const { AllowedFileType } = require('../../../../enums/allowed-file-type');
const { UserRoles } = require('../../../../enums/user-roles');

const { addImageToProduct } = require('../../../../controllers/product-controller');
const { authorize } = require('../../../../controllers/user-controller');

const schema = {
    headers,
    params: S.object().prop('id', productIdSchema).required(['id']),
    response: {
        200: productSchema
    }
};

const options = ({ prisma, authService }) => ({
    schema,
    preValidation: authorize({ authService, prisma }, [UserRoles.EMPLOYEE, UserRoles.ADMIN])
});

module.exports = async server => {
    const { prisma, storage, to, authService, toHttpError } = server;

    server.post('/', options({ authService, prisma }), async (request, reply) => {
        const data = await request.file();

        //If there is not file content
        if (!data?.filename) {
            await reply.badRequest('Missing file content');
            return;
        }

        const { mimetype, file } = data;
        const fileType = mimetype.split('/')[1]?.toLowerCase();

        //If the file type is not allowed
        if (!Object.values(AllowedFileType).includes(fileType)) {
            await reply.badRequest('File type not allowed');
            return;
        }

        const { id } = request.params;

        const [error, product] = await to(
            addImageToProduct(
                { prisma, storage, to },
                { productId: id, file, fileType, createdBy: request.user.id }
            )
        );

        return error ? toHttpError(error) : product;
    });
};
