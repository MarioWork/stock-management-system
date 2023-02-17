const S = require('fluent-json-schema');

const paginationMetadataSchema = S.object()
    .prop('page', S.number())
    .prop('size', S.number())
    .prop('total', S.number())
    .required(['size', 'page', 'total']);

module.exports = paginationMetadataSchema;
