const S = require('fluent-json-schema');

const { userSchema } = require('../schemas/user-schema');

const categoryIdSchema = S.string().format('uuid');

const categoryNameSchema = S.string();

const categoryCreatedAtSchema = S.string().format('date-time');

const categoryUpdatedAtSchema = S.string().format('date-time');

const categoryCreatedBySchema = S.oneOf([userSchema, S.null()]);

const categorySchema = S.object()
    .prop('id', categoryIdSchema)
    .prop('createdBy', categoryCreatedBySchema)
    .prop('name', categoryNameSchema)
    .prop('createdAt', categoryCreatedAtSchema)
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
