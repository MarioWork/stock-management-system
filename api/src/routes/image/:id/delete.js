const { deleteFile } = require('../../../controllers/file-controller');

const schema = {};

const options = { schema };

module.exports = async server => {
    const { to, storage, prisma } = server;

    server.delete('/', options, async (request, reply) => {
        const { id } = request.params;

        const [error] = await to(deleteFile({ prisma, storage }, id));

        if (error) {
            if (error.statusCode === 404) {
                await reply.notFound(error.message);
                return;
            }

            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ message: 'Delete successfully!' });
    });
};
