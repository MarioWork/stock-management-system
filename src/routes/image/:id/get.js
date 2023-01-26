//TODO: Add schema
module.exports = async server => {
    server.get('/', {}, async (request, reply) => {
        const { id } = request.params;
        const { filename } = request.query;

        const fileBuffer = await server.downloadFile(id, filename);

        reply.type('image');
        await reply.send(fileBuffer[0]);
    });
};
