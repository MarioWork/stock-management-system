const S = require('fluent-json-schema');

const { AllowedFileType } = require('../../../enums/allowed-file-type');

const schema = {
    params: S.object().prop('id', S.string()).required(['id']),
    query: S.object()
        .prop('type', S.string().enum(Object.values(AllowedFileType)))
        .required(['type'])
};

const options = { schema };

module.exports = async server => {
    const { to, downloadFile } = server;
    server.get('/', options, async (request, reply) => {
        const { id } = request.params;
        const { type } = request.query;

        const [error, fileBuffer] = await to(downloadFile(id, type));

        if (error) {
            if (error.code === 404) {
                await reply.notFound();
                return;
            }
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        reply.type('image');
        await reply.send(fileBuffer[0]);
    });
};
