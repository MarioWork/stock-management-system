const S = require('fluent-json-schema');

const { userSchema } = require('../schemas/user-schema');

const categoryIdSchema = S.string().format('uuid');

const categoryNameSchema = S.string();

const categoryCreatedAtSchema = S.string().format('date-time');

const categoryUpdatedAtSchema = S.string().format('date-time');

const categoryCreatedBySchema = userSchema;

const categorySchema = S.object()
    .prop('id', categoryIdSchema)
    .prop('name', categoryNameSchema)
    .prop('createdAt', categoryCreatedAtSchema)
    .prop('createdBy', categoryCreatedBySchema)
    .prop('updatedAt', categoryUpdatedAtSchema)
    .required(['id']);

module.exports = {
    categoryIdSchema,
    categoryNameSchema,
    categorySchema,
    categoryCreatedAtSchema,
    categoryUpdatedAtSchema,
    categoryCreatedBySchema
};
