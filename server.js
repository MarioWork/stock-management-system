const path = require('path');
const autoload = require('@fastify/autoload');

const server = require('fastify')({ logger: true });

const PORT = '5000';

server.register(autoload, {
    dir: path.join(__dirname, 'plugins')
});

const start = async () => {
    try {
        await server.listen(PORT);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();
