const fp = require('fastify-plugin');
const { PluginNames } = require('../enums/plugins');

const DEFAULT_PAGE_SIZE = 10;

const plugin = (server, _, done) => {
    server.decorateRequest('parsePaginationQuery', function () {
        const { query } = this;

        return {
            get currentPage() {
                const queryPage = Number.parseInt(query.page, 10);
                return Number.isNaN(queryPage) ? 1 : queryPage;
            },
            get querySize() {
                const querySize = Number.parseInt(query.size, 10);
                return Number.isNaN(querySize) ? DEFAULT_PAGE_SIZE : querySize;
            },
            get recordsToSkip() {
                const page = this.currentPage - 1;
                return page === 0 ? page : page * this.querySize;
            }
        };
    });

    server.decorateReply('withPagination', function ({ total, page, size, data }) {
        return this.send({
            _metadata: {
                page,
                size,
                total
            },
            data
        });
    });

    done();
};

const options = { name: PluginNames.PAGINATION };

module.exports = fp(plugin, options);
