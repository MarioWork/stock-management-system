const S = require('fluent-json-schema');

const { categorySchema } = require('../schemas/category-schema');
const { fileSchema } = require('../schemas/file-schema');
const { supplierSchema } = require('../schemas/supplier-schema');

const productIdSchema = S.string().format('uuid');

const productNameSchema = S.string();

const productQuantitySchema = S.number();

const productImagesSchema = S.array().items(fileSchema);

const productCreatedAtSchema = S.string().format('date-time');

const productUpdatedAtSchema = S.string().format('date-time');

const productCategoriesSchema = S.array().items(categorySchema);

const productSchema = S.object()
    .prop('id', productIdSchema)
    .prop('name', productNameSchema)
    .prop('quantity', productQuantitySchema)
    .prop('createdAt', productCreatedAtSchema)
    .prop('updatedAt', productUpdatedAtSchema)
    .prop('images', productImagesSchema)
    .prop('categories', productCategoriesSchema)
    .prop('supplier', supplierSchema)
    .required(['id']);

module.exports = {
    productIdSchema,
    productNameSchema,
    productQuantitySchema,
    productCreatedAtSchema,
    productUpdatedAtSchema,
    productImagesSchema,
    productCategoriesSchema,
    productSchema
};
