const fp = require('fastify-plugin');
const { PrismaClient } = require('@prisma/client');

const name = 'Prisma';

const plugin = async server => {
    server.log.info(`Registering ${name} plugin...`);

    const prisma = new PrismaClient();

    await prisma.$connect();

    server.decorate('prisma', prisma);

    server.addHook('onClose', async server => {
        await server.prisma.$disconnect();
    });
};

const options = { name: name };

module.exports = fp(plugin, options);
