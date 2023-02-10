const S = require('fluent-json-schema');

const productSchema = require('../../../../schemas/product-schema');
const { AllowedFileType } = require('../../../../enums/allowed-file-type');
const { addImageToProduct } = require('../../../../controllers/product-controller');

const schema = {
    params: S.object().prop('id', S.number()).required(['id']),
    response: {
        200: productSchema
    }
};

const options = { schema };

module.exports = async server => {
    const { prisma, storage, to } = server;

    server.post('/', options, async (request, reply) => {
        const data = await request.file();

        //If there is not file content
        if (!data) {
            await reply.badRequest('Missing file content');
            return;
        }

        const { mimetype, file } = await request.file();
        const fileType = mimetype.split('/')[1]?.toLowerCase();

        //If the file type is not allowed
        if (!Object.values(AllowedFileType).includes(fileType)) {
            await reply.badRequest('File type not allowed');
            return;
        }

        const { id } = request.params;

        const [error, product] = await to(
            addImageToProduct({ prisma, storage, to }, { productId: id, file, fileType })
        );

        if (error) {
            if (error?.statusCode === 404) {
                await reply.notFound(error.message);
                return;
            }

            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(product);
    });
};
