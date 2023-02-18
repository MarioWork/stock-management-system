const fp = require('fastify-plugin');
const { PrismaClient } = require('@prisma/client');

const { PluginNames } = require('../enums/plugins');
/**
 * Creates a Prisma connection to the database
 * Decorates the fastify instance with a prisma client instance
 * @param {*} server - Fastify server instance
 */
const plugin = async server => {
    server.log.info(`Registering ${PluginNames.PRISMA} plugin...`);

    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
    } catch (error) {
        server.log.error(error);
    }

    server.decorate('prisma', prisma);
};

const options = { name: PluginNames.PRISMA };

module.exports = fp(plugin, options);
