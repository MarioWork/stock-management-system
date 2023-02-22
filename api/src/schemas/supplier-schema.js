const S = require('fluent-json-schema');

const supplierIdSchema = S.string();

const supplierNameSchema = S.string().minLength(2).maxLength(40);

const supplierNifSchema = S.string().minLength(9).maxLength(9);

const supplierSchema = S.object()
    .prop('id', supplierIdSchema)
    .prop('name', supplierNameSchema)
    .prop('nif', supplierNifSchema)
    .required(['id', 'name', 'nif']);

module.exports = {
    supplierIdSchema,
    supplierNameSchema,
    supplierNifSchema,
    supplierSchema
};
