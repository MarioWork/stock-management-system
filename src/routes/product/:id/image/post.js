const S = require('fluent-json-schema');

const { addImageUrlToProduct } = require('../../../../controllers/product-controller');

const schema = {
    params: S.object().prop('id', S.number()).required(['id']),
    response: {
        200: S.object().prop('message', S.string()).required(['message'])
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

        const [saveFileError, url] = await to(saveFile(data.file, data.filename, id));

        if (saveFileError) {
            server.log.error(saveFileError);
            await reply.internalServerError();
            return;
        }

        const [addImageUrlError] = await to(addImageUrlToProduct({ prisma }, { id, url }));

        //TODO: create method to delete image in case of error

        if (addImageUrlError) {
            server.log.error(addImageUrlError);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ message: 'Added image successfully' });
    });
};
