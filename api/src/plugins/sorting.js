const fp = require('fastify-plugin');
const { BadRequest } = require('http-errors');

const { ErrorCodesKeys } = require('../enums/error-codes');
const { PluginNames } = require('../enums/plugins');
const { Entities } = require('../enums/entities');

const { ErrorMessages } = require('../localization/error-messages');

const OrderType = {
    DESC: 'desc',
    ASC: 'asc'
};

const FieldsAllowed = new Map();

FieldsAllowed.set(Entities.PRODUCT, [
    'name',
    'upc',
    'description',
    'createdAt',
    'updatedAt',
    'quantity'
]);
FieldsAllowed.set(Entities.CATEGORY, ['name', 'createdAt', 'updatedAt']);
FieldsAllowed.set(Entities.SUPPLIER, ['name', 'nif', 'createAt', 'updatedAt']);
FieldsAllowed.set(Entities.USER, [
    'firstName',
    'lastName',
    'nif',
    'email',
    'updatedAt',
    'createdAt'
]);

const plugin = (server, _, done) => {
    server.decorateRequest('parseSortingQuery', function (entity) {
        const { sort, order } = this.query;

        const allowedFields = FieldsAllowed.get(entity);
        const isFieldAllowed = !FieldsAllowed.get(entity).includes(sort);

        if (sort && isFieldAllowed)
            throw new BadRequest(
                ErrorMessages.get(ErrorCodesKeys.INVALID_SORTING_FIELD)(allowedFields)
            );

        return {
            sort: sort ? sort : undefined,
            order: Object.values(OrderType).includes(order?.toLowerCase())
                ? order.toLowerCase()
                : OrderType.DESC
        };
    });

    done();
};

const options = { name: PluginNames.SORTING };

module.exports = fp(plugin, options);
