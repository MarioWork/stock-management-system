const S = require('fluent-json-schema');

const { fileIdSchema } = require('../../../schemas/file-schema');

const { downloadFile } = require('../../../controllers/file-controller');

const schema = {
    params: S.object().prop('id', fileIdSchema).required(['id'])
};

const options = {
    schema
};

module.exports = async server => {
    const { to, storage, prisma, toHttpError } = server;
    server.get('/', options, async (request, reply) => {
        const { id } = request.params;

        const [error, fileBuffer] = await to(downloadFile({ storage, prisma }, id));

        if (error) return toHttpError(error);

        reply.type('image');
        return fileBuffer[0];
    });
};
