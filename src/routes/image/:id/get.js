const S = require('fluent-json-schema');

//TODO: Move to separate file
const AllowedFileType = {
    PNG: 'png',
    JPG: 'jpg',
    JPEG: 'jpeg'
};

const schema = {
    params: S.object().prop('id', S.string()).required(['id']),
    query: S.object()
        .prop('type', S.string().enum(Object.values(AllowedFileType)))
        .required(['type'])
};

const options = { schema };

module.exports = async server => {
    server.get('/', options, async (request, reply) => {
        const { id } = request.params;
        const { type } = request.query;

        const fileBuffer = await server.downloadFile(id, type);

        reply.type('image');
        await reply.send(fileBuffer[0]);
    });
};
