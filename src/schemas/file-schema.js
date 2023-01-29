const S = require('fluent-json-schema');

const fileSchema = S.object()
    .prop('id', S.string())
    .prop('url', S.string())
    .prop('type', S.string())
    .required(['url']);

module.exports = fileSchema;
