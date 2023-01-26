require('dotenv').config();
const path = require('path');

const sensible = require('@fastify/sensible');
const autoload = require('@fastify/autoload');
const multipart = require('@fastify/multipart');

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

//To use an encapsulation of try and catch && http errors
server.register(sensible);

//Parse Multipart content-type
server.register(multipart);

//Auto load all plugins
server.register(autoload, {
    dir: path.join(__dirname, 'plugins')
});

//Auto load all routes plugins
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
