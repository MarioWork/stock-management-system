const S = require('fluent-json-schema');

const { categorySchema } = require('../schemas/category-schema');
const { fileSchema } = require('../schemas/file-schema');
const { supplierSchema } = require('../schemas/supplier-schema');

const productIdSchema = S.string().format('uuid');

const productNameSchema = S.string();

const productQuantitySchema = S.number();

const productImagesSchema = S.array().items(fileSchema);

const productCategoriesSchema = S.array().items(categorySchema);

const productSchema = S.object()
    .prop('id', productIdSchema)
    .prop('name', productNameSchema)
    .prop('quantity', productQuantitySchema)
    .prop('images', productImagesSchema)
    .prop('categories', productCategoriesSchema)
    .prop('supplier', supplierSchema)
    .required(['id', 'name', 'quantity', 'images', 'categories', 'supplier']);

module.exports = {
    productIdSchema,
    productNameSchema,
    productQuantitySchema,
    productImagesSchema,
    productCategoriesSchema,
    productSchema
};
