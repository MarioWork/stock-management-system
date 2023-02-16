const fp = require('fastify-plugin');
const { PluginNames } = require('../enums/plugins');

const DEFAULT_PAGE_SIZE = 10;

const plugin = (server, _, done) => {
    server.decorateRequest('parsePaginationQuery', function () {
        const { query } = this;

        return {
            get querySize() {
                const querySize = Number.parseInt(query.size, 10);
                return Number.isNaN(querySize) ? DEFAULT_PAGE_SIZE : querySize;
            },
            get recordsToSkip() {
                const queryPage = Number.parseInt(query.page, 10) - 1;
                const page = Number.isNaN(queryPage) ? 0 : queryPage;
                return page === 0 ? page : page * this.take;
            }
        };
    });

    server.decorateReply('withPagination', function () {});

    done();
};

const options = { name: PluginNames.PAGINATION };

module.exports = fp(plugin, options);
