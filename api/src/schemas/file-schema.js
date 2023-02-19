const S = require('fluent-json-schema');

const { AllowedFileType } = require('../enums/allowed-file-type');

const fileIdSchema = S.string().format('uuid');
const fileUrlSchema = S.string().format('url');
const fileTypeSchema = S.string().enum(Object.values(AllowedFileType));

const fileSchema = S.object()
    .prop('id', fileIdSchema)
    .prop('url', fileUrlSchema)
    .prop('type', fileTypeSchema)
    .required(['url']);

module.exports = fileSchema;
