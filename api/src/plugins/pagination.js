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
            get pageSize() {
                const pageSize = Number.parseInt(query.size, 10);
                return Number.isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize;
            },
            get pastRecordsCount() {
                const page = this.currentPage - 1;
                return page === 0 ? page : page * this.pageSize;
            }
        };
    });

    server.decorateReply('withPagination', function ({ total, page, data }) {
        const { pastRecordsCount } = this.request.parsePaginationQuery();

        const size = data.length;
        const empty = size === 0;

        const contentRange = `items ${
            empty ? '*/0' : `${pastRecordsCount}-${pastRecordsCount + data.length - 1}`
        }/${total}`;

        return this.header('Content-Range', contentRange).code(206).send({
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
