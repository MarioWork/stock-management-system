const fp = require('fastify-plugin');
const { PluginNames } = require('../enums/plugins');

const plugin = (server, _, done) => {
    server.decorateRequest('parseSortingQuery', function (allowedFields) {
        const { sort, order } = this.query;

        return {
            sort: allowedFields?.includes(sort.toLowerCase()) ? sort : undefined,
            order: order !== 'desc' || order !== 'asc' ? order : undefined
        };
    });

    done();
};

const options = { name: PluginNames.SORTING };

module.exports = fp(plugin, options);
