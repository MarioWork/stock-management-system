const fp = require('fastify-plugin');
const { BadRequest } = require('http-errors');
const { ErrorCodesKeys } = require('../enums/error-codes');

const { PluginNames } = require('../enums/plugins');
const { ErrorMessages } = require('../localization/error-messages');

const OrderType = {
    DESC: 'desc',
    ASC: 'asc'
};

const plugin = (server, _, done) => {
    server.decorateRequest('parseSortingQuery', function (allowedFields) {
        const { sort, order } = this.query;

        if (sort && !allowedFields?.includes(sort.toLowerCase()))
            throw new BadRequest(
                ErrorMessages.get(ErrorCodesKeys.INVALID_SORTING_FIELD)(allowedFields)
            );

        return {
            sort: sort ? sort : undefined,
            order: order !== OrderType.DESC || order !== OrderType.ASC ? order : OrderType.DESC
        };
    });

    done();
};

const options = { name: PluginNames.SORTING };

module.exports = fp(plugin, options);
