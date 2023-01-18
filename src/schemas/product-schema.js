const S = require('fluent-json-schema');
const categorySchema = require('../schemas/category-schema');

const productSchema = S.object()
    .prop('id', S.number())
    .prop('name', S.string())
    .categories('categories', S.array().items(categorySchema))
    .required(['id', 'name', 'categories']);

module.exports = productSchema;
