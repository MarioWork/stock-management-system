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
        const { pastRecordsCount, pageSize } = this.request.parsePaginationQuery();

        const currentPageSize = data.length;
        const empty = currentPageSize === 0;

        const contentRange = `items ${
            empty ? '*/0' : `${pastRecordsCount}-${pastRecordsCount + data.length - 1}`
        }/${total}`;

        const lastPage = Math.ceil(total / pageSize);

        return this.header('Content-Range', contentRange)
            .code(206)
            .send({
                _metadata: {
                    currentPage: page,
                    currentPageSize,
                    firstPage: 1,
                    lastPage,
                    pageSize,
                    totalRecords: total
                },
                data
            });
    });

    done();
};

const options = { name: PluginNames.PAGINATION };

module.exports = fp(plugin, options);
