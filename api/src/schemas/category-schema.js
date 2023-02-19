const S = require('fluent-json-schema');

const categorySchema = S.object()
    .prop('id', S.string().format('uuid'))
    .prop('name', S.string())
    .required(['id', 'name']);

module.exports = categorySchema;
