/**
 * @typedef {import("../types/prisma-docs-type")} PrismaClient
 * @typedef { import('../types/category-docs-type') } Category
 * @typedef { import('../types/product-docs-type') } Product
 */

const { NotFound } = require('http-errors');
const { saveFile, deleteFile } = require('../services/cloud-storage/cloud-file-service');
const {
    createProduct: createProductPrisma,
    deleteProducts: deleteProductsPrisma,
    getProductById: getProductByIdPrisma,
    getAllProducts: getAllProductsPrisma,
    updateProduct: updateProductPrisma,
    addImageToProduct: addImageToProductPrisma,
    productExists
} = require('../services/prisma/product-service');

/**
 * Retrieves a product by Id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number} id - Id of the product to retrieve
 * @returns {Promise<Product>} - Promise object that returns product or error
 * @throws {error}
 */
const getProductById = (prisma, id) => {
    return getProductByIdPrisma(prisma, id);
};

/**
 * Retrieves all products
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} filter - text to search with
 * @returns {Promise} - Promise object that returns product array and count of records
 * @throws {error}
 */
//TODO: add supplier filter
const getAllProducts = (prisma, { filter, pagination, categoryId }) =>
    getAllProductsPrisma(prisma, { filter, categoryId, pagination });

/**
 * Creates a product with the properties given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{name: string, quantity: number, categories: number[]}} object - Object represents the product to create
 * @returns {Product}
 * @throws {error}
 */
//TODO: Fix docs
const createProduct = async (
    prisma,
    { name, description, quantity, categories, supplier, upc, createdBy }
) => {
    const categoriesObjArray = categories?.map(catId => ({ id: catId }));

    try {
        return await createProductPrisma(prisma, {
            name,
            quantity,
            categories: categoriesObjArray,
            supplier,
            description,
            upc,
            createdBy
        });
    } catch (error) {
        if (error.code === 'P2025') {
            const field = error.meta.cause.match(/'(.*?)'/i)[0];
            throw new NotFound(`${field} does not exist`);
        }
        throw error;
    }
};

/**
 * Deletes products by the ids given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Ids of the products to be deleted
 * @returns {{count:number}} - Object with count property represents number of products deleted
 * @throws {error}
 */
const deleteProducts = (prisma, ids) => {
    return deleteProductsPrisma(prisma, ids);
};

/**
 * Updates the category based on the properties given
 * Does not need all properties but, needs at least one (name, quantity, categories)
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: number,quantity: number=, categories: Category[]=}} object - Object that represents what to update
 * @returns {Product}
 */
//TODO: add supplier
const updateProduct = async (prisma, { id, name, quantity, categories }) => {
    const categoriesObjArray = categories?.map(catId => ({ id: catId }));
    try {
        return await updateProductPrisma(prisma, {
            id,
            name,
            quantity,
            categories: categoriesObjArray
        });
    } catch (error) {
        if (error.code === 'P2016') throw new NotFound(`Product with ID: ${id} was not found`);
        if (error.code === 'P2025') {
            const field = error.meta.cause.match(/'(.*?)'/i)[0];
            throw new NotFound(`${field} does not exist`);
        }
        throw error;
    }
};
/**
 * Adds a image url to the list of images of the product
 * @param {{prisma: PrismaClient, storage: *, to: *}} object - Dependencies
 * @param {{id: number, url: string}} object - Object with product id and image url
 * @returns {Product} - Returns the updated product
 * @throws {error}
 */
const addImageToProduct = async ({ prisma, storage, to }, { productId, file, fileType }) => {
    const [findProductError, product] = await to(productExists(prisma, productId));

    if (!product) throw new NotFound(`Product with ID: ${productId} was not found`);
    if (findProductError) throw findProductError;

    const { fileUrl, fileId } = await saveFile(storage, { file: file, type: fileType });

    const [error, updatedProduct] = await to(
        addImageToProductPrisma(prisma, { productId, fileId, fileType, fileUrl })
    );

    if (error) {
        await deleteFile(storage, { id: fileId, type: fileType });
        throw error;
    }

    return updatedProduct;
};

module.exports = {
    createProduct,
    deleteProducts,
    getProductById,
    getAllProducts,
    updateProduct,
    addImageToProduct
};
