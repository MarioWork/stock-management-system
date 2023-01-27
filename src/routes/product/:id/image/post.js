const S = require('fluent-json-schema');

const productSchema = require('../../../../schemas/product-schema');
const { AllowedFileType } = require('../../../../enums/allowed-files-type');
const { addImageUrlToProduct } = require('../../../../controllers/product-controller');

const schema = {
    params: S.object().prop('id', S.number()).required(['id']),
    response: {
        200: productSchema
    }
};

const options = { schema };

module.exports = async server => {
    const { prisma, saveFile, to } = server;

    server.post('/', options, async (request, reply) => {
        const data = await request.file();

        if (data.filename === '') {
            await reply.badRequest('Missing file content');
            return;
        }

        const { id } = request.params;

        const fileType = data.mimetype.split('/')[1];

        if (!Object.values(AllowedFileType).includes(fileType.toLowerCase())) {
            await reply.badRequest('File type not allowed');
            return;
        }

        const [saveFileError, url] = await to(saveFile(data.file, fileType));

        if (saveFileError) {
            server.log.error(saveFileError);
            await reply.internalServerError();
            return;
        }

        const [addImageUrlError, product] = await to(addImageUrlToProduct(prisma, { id, url }));

        //TODO: create method to delete image in case of error
        if (!product) {
            await reply.notFound(`Product with ID: ${id} was not found`);
            return;
        }

        //TODO: create method to delete image in case of error
        if (addImageUrlError) {
            server.log.error(addImageUrlError);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send(product);
    });
};
