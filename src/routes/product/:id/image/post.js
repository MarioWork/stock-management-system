const S = require('fluent-json-schema');

const productSchema = require('../../../../schemas/product-schema');
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

        //TODO: allow only png jpg and jpeg
        const fileType = data.mimetype.split('/')[1];

        const [saveFileError, url] = await to(saveFile(data.file, fileType));

        if (saveFileError) {
            server.log.error(saveFileError);
            await reply.internalServerError();
            return;
        }

        const [addImageUrlError, product] = await to(addImageUrlToProduct(prisma, { id, url }));

        //TODO: create method to delete image in case of error
        if (!product) {
            await reply.notFound(`No product found with ID: ${id}`);
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
