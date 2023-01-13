const fp = require('fastify-plugin');
const { PrismaClient } = require('@prisma/client');

const name = 'Prisma';

const plugin = async server => {
    server.log.info(`Registering ${name} plugin...`);

    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
    } catch (error) {
        server.log.error(error);
    }

    server.decorate('prisma', prisma);

    server.addHook('onClose', async server => {
        await server.prisma.$disconnect();
    });
};

const options = { name: name };

module.exports = fp(plugin, options);
