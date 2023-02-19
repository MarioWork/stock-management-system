const S = require('fluent-json-schema');
const categorySchema = require('../schemas/category-schema');
const fileSchema = require('../schemas/file-schema');

const productSchema = S.object()
    .prop('id', S.string())
    .prop('name', S.string())
    .prop('quantity', S.string())
    .prop('images', S.array().items(fileSchema))
    .prop('categories', S.array().items(categorySchema))
    .required(['id', 'name', 'quantity', 'images', 'categories']);

module.exports = productSchema;
