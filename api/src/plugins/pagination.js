const fp = require('fastify-plugin');
const { PluginNames } = require('../enums/plugins');

const plugin = (server, _, done) => {};

const options = { name: PluginNames.PAGINATION };

module.exports = fp(plugin, options);
