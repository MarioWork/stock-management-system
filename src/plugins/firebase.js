const fp = require('fastify-plugin');

const NAME = 'Firebase';

const plugin = async server => {
    server.log.info(`Registering ${NAME} plugin...`);
};

const options = { name: NAME };

module.exports = fp(plugin, options);
