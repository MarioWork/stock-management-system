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
        const { id } = request.params;

        const [saveFileError, url] = await to(saveFile(data.file, data.filename));

        if (saveFileError) {
            server.log.error(saveFileError);
            await reply.internalServerError();
            return;
        }

        const [addImageUrlError] = await to(addImageUrlToProduct({ prisma }, { id, url }));

        if (addImageUrlError) {
            server.log.error(addImageUrlError);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ message: 'Added image successfully' });
    });
};
