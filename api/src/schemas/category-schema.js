const S = require('fluent-json-schema');

const categoryIdSchema = S.string().format('uuid');

const categoryNameSchema = S.string();

const categoryCreatedAtSchema = S.string().format('date-time');

const categoryUpdatedAtSchema = S.string().format('date-time');

const categorySchema = S.object()
    .prop('id', categoryIdSchema)
    .prop('name', categoryNameSchema)
    .prop('createdAt', categoryCreatedAtSchema)
    .prop('updatedAt', categoryUpdatedAtSchema)
    .required(['id']);

module.exports = {
    categoryIdSchema,
    categoryNameSchema,
    categorySchema,
    categoryCreatedAtSchema,
    categoryUpdatedAtSchema
};
