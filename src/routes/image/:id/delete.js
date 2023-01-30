const { deleteFile } = require('../../../controllers/file-controller');

const schema = {};

const options = { schema };

module.exports = async server => {
    const { to, storage, prisma } = server;

    server.delete('/', options, async (request, reply) => {
        const { id } = request.params;

        const [error, count] = await to(deleteFile({ prisma, storage }, id));

        if (count === 0 || error === 404) {
            console.log('xd');
            await reply.notFound();
            return;
        }

        if (error) {
            server.log.error(error);
            await reply.internalServerError();
            return;
        }

        await reply.code(200).send({ message: 'Delete successfully!' });
    });
};
