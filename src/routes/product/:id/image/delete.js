const S = require('fluent-json-schema');

const productSchema = require('../../../../schemas/product-schema');
const { AllowedFileType } = require('../../../../enums/allowed-file-type');
const { deleteFile } = require('../../../../services/cloud-storage/file-service');

const schema = {
    params: S.object().prop('id', S.number()).required(['id'])
};

const options = { schema };

module.exports = async server => {
    const { prisma, storage, to } = server;

    server.delete('/', options, async (request, reply) => {
        const { url } = request.body;
        const { id } = request.params;

        const idRegex = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        const fileId = idRegex.exec(url)[0];

        const typeRegex = new RegExp(/(?<=type=).*$/);
        const type = typeRegex.exec(url)[0];

        if (!fileId || !AllowedFileType.includes(type)) {
            await reply.badRequest('Bad image url format');
        }

        await removeImageFromProduct(prisma, { productId, url });
        await deleteFile(storage, { fileId, type });

        await reply.code(200).send({ fileId, type });
    });
};
