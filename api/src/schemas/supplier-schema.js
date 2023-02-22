const S = require('fluent-json-schema');

const supplierIdSchema = S.string().format('uuid');

const supplierNameSchema = S.string().minLength(2).maxLength(40);

const supplierNifSchema = S.string().minLength(9).maxLength(9);

const supplierCreatedAtSchema = S.string().format('date-time');

const supplierUpdatedAtSchema = S.string().format('date-time');

const supplierSchema = S.object()
    .prop('id', supplierIdSchema)
    .prop('name', supplierNameSchema)
    .prop('nif', supplierNifSchema)
    .prop('updatedAt', supplierUpdatedAtSchema)
    .prop('createdAt', supplierCreatedAtSchema)
    .required(['id', 'name', 'nif']);

module.exports = {
    supplierIdSchema,
    supplierNameSchema,
    supplierNifSchema,
    supplierSchema
};
