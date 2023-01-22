const fp = require('fastify-plugin');
const { PrismaClient } = require('@prisma/client');

const NAME = 'Prisma';

/**
 * Creates a Prisma connection to the database
 * Decorates the fastify instance with a prisma client instance
 * @param {*} server - Fastify server instance
 */
const plugin = async server => {
    server.log.info(`Registering ${NAME} plugin...`);

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

const options = { name: NAME };

module.exports = fp(plugin, options);
