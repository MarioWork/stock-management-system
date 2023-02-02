const S = require('fluent-json-schema');

const { downloadFile } = require('../../../controllers/file-controller');

const schema = {
    params: S.object().prop('id', S.string()).required(['id'])
};

const options = { schema };

module.exports = async server => {
    const { to, storage, prisma } = server;
    server.get('/', options, async (request, reply) => {
        const { id } = request.params;

        const [error, fileBuffer] = await to(downloadFile({ storage, prisma }, id));

        if (error) {
            if (error.code === 404) {
                await reply.notFound('Image not found');
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
