const S = require('fluent-json-schema');

const categoryIdSchema = S.string().format('uuid');

const categoryNameSchema = S.string();

const categorySchema = S.object()
    .prop('id', categoryIdSchema)
    .prop('name', categoryNameSchema)
    .required(['id', 'name']);

module.exports = {
    categoryIdSchema,
    categoryNameSchema,
    categorySchema
};
