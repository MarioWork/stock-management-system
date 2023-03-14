const fp = require('fastify-plugin');
const { PluginNames } = require('../enums/plugins');

const plugin = (server, _, done) => {
    server.decorateRequest('parseSortingQuery', function () {
        const { sort, order } = this;

        return {
            sort,
            order
        };
    });

    done();
};

const options = { name: PluginNames.SORTING };

module.exports = fp(plugin, options);
