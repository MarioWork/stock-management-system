const fp = require('fastify-plugin');
const { PluginNames } = require('../enums/plugins');

const plugin = (server, _, done) => {
    done();
};

const options = { name: PluginNames.SORTING };

module.exports = fp(plugin, options);
