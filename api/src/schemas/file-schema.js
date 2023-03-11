const S = require('fluent-json-schema');

const { AllowedFileType } = require('../enums/allowed-file-type');

const fileIdSchema = S.string().format('uuid');

const fileUrlSchema = S.string();

const fileTypeSchema = S.string().enum(Object.values(AllowedFileType));

const fileSchema = S.object()
    .prop('id', fileIdSchema)
    .prop('createdBy')
    .prop('url', fileUrlSchema)
    .prop('type', fileTypeSchema)
    .required(['url']);

module.exports = { fileSchema, fileIdSchema, fileUrlSchema, fileTypeSchema };
