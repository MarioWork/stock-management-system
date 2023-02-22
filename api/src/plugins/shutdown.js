const fp = require('fastify-plugin');
const { PluginNames } = require('../enums/plugins');

const EVENTS = ['SIGINT', 'SIGTERM'];

/**
 * Decorates server with graceful shutdown.
 * @param {import('fastify').FastifyInstance} server - the server instance.
 */
const register = async function (server) {
    server.log.info(`Registering ${PluginNames.SHUTDOWN} plugin...`);

    EVENTS.forEach(event => {
        process.once(event, async () => {
            server.log.info('Shutting down server');

            try {
                await server.prisma.$disconnect();
                await server.close(() => process.exit());
            } catch (error) {
                server.log.error(error);
            }
        });
    });
};

const options = { name: PluginNames.SHUTDOWN };

module.exports = fp(register, options);
