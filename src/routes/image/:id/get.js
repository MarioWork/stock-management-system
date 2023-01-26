//TODO: Add schema
module.exports = async server => {
    server.get('/', {}, async (request, reply) => {
        const { id } = request.params;
        const { type } = request.query;

        const fileBuffer = await server.downloadFile(id, type);

        reply.type('image');
        await reply.send(fileBuffer[0]);
    });
};
