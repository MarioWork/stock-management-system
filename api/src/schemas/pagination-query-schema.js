const S = require('fluent-json-schema');

const sizeSchema = S.number();

const pageSchema = S.number();

module.exports = { sizeSchema, pageSchema };
