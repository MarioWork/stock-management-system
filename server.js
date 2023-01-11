require('dotenv').config();

const path = require('path');
const autoload = require('@fastify/autoload');

const server = require('fastify')({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: true,
                colorize: true
            }
        }
    }
});

//Auto load all plugins
server.register(autoload, {
    dir: path.join(__dirname, 'plugins')
});

//Auto load all routes
server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api' },
    routerParams: true
});

const start = async () => {
    try {
        await server.listen({ port: process.env.PORT || 5000 });
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();
