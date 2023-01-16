const S = require('fluent-json-schema');

const categorySchema = S.object()
    .prop('id', S.number())
    .prop('name', S.string())
    .required(['id', 'name']);

module.exports = categorySchema;
