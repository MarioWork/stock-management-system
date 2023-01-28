const S = require('fluent-json-schema');

const productSchema = require('../../../../schemas/product-schema');
const { AllowedFileType } = require('../../../../enums/allowed-file-type');
const { addImageUrlToProduct } = require('../../../../controllers/product-controller');
const { saveFile } = require('../../../../services/firebase/file-service');

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
        const { mimetype, filename, file } = await request.file();
        const fileType = mimetype.split('/')[1];

        if (filename === '') {
            await reply.badRequest('Missing file content');
            return;
        }

        if (!Object.values(AllowedFileType).includes(fileType.toLowerCase())) {
            await reply.badRequest('File type not allowed');
            return;
        }

        const { id } = request.params;

        const [saveFileError, url] = await to(saveFile(storage, { file: file, fileType }));

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
