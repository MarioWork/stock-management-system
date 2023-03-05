const S = require('fluent-json-schema');

const { AllowedFileType } = require('../enums/allowed-file-type');
const { userSchema } = require('../schemas/user-schema');

const fileIdSchema = S.string().format('uuid');

const fileUrlSchema = S.string().format('url');

const fileTypeSchema = S.string().enum(Object.values(AllowedFileType));

const fileCreatedBySchema = userSchema;

const fileSchema = S.object()
    .prop('id', fileIdSchema)
    .prop('createdBy', fileCreatedBySchema)
    .prop('url', fileUrlSchema)
    .prop('type', fileTypeSchema)
    .required(['url']);

module.exports = { fileSchema, fileIdSchema, fileUrlSchema, fileTypeSchema, fileCreatedBySchema };
