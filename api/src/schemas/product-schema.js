const S = require('fluent-json-schema');

const { categorySchema } = require('../schemas/category-schema');
const { fileSchema } = require('../schemas/file-schema');
const { userSchema } = require('../schemas/user-schema');
const { supplierSchema } = require('../schemas/supplier-schema');

const productIdSchema = S.string().format('uuid');

const productNameSchema = S.string();

const productUpcSchema = S.string().minLength(12).maxLength(13);

const productDescriptionSchema = S.string().maxLength(300);

const productCreatedBySchema = userSchema;

const productQuantitySchema = S.number();

const productImagesSchema = S.array().items(fileSchema);

const productCreatedAtSchema = S.string().format('date-time');

const productUpdatedAtSchema = S.string().format('date-time');

const productCategoriesSchema = S.array().items(categorySchema);

const productSchema = S.object()
    .prop('id', productIdSchema)
    .prop('name', productNameSchema)
    .prop('description', productDescriptionSchema)
    .prop('upc', productUpcSchema)
    .prop('quantity', productQuantitySchema)
    .prop('createdAt', productCreatedAtSchema)
    .prop('createdBy', productCreatedBySchema)
    .prop('updatedAt', productUpdatedAtSchema)
    .prop('images', productImagesSchema)
    .prop('categories', productCategoriesSchema)
    .prop('supplier', supplierSchema)
    .required(['id']);

module.exports = {
    productIdSchema,
    productNameSchema,
    productDescriptionSchema,
    productUpcSchema,
    productQuantitySchema,
    productCreatedAtSchema,
    productCreatedBySchema,
    productUpdatedAtSchema,
    productImagesSchema,
    productCategoriesSchema,
    productSchema
};
