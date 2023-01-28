/**
 * @typedef { import("../types/prisma-docs-type") } PrismaClient
 * @typedef { import('../types/category-docs-type') } Category
 * @typedef { import('../types/product-docs-type') } Product
 */
const {
    createProduct: createProductPrisma,
    deleteProducts: deleteProductsPrisma,
    getProductById: getProductByIdPrisma,
    getAllProducts: getAllProductsPrisma,
    updateProduct: updateProductPrisma
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
 * @param {string} query - text to search with
 * @returns {Promise<Product[]>} - Promise object that returns product array or error
 * @throws {error}
 */
const getAllProducts = (prisma, query) => {
    return getAllProductsPrisma(prisma, query);
};

/**
 * Creates a product with the properties given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{name: string, quantity: number, categories: {id: number}[]}} object - Object represents the product to create
 * @returns {Promise<Product>} - Promise object that returns product or error
 * @throws {error}
 */
const createProduct = (prisma, { name, quantity, categories }) => {
    return createProductPrisma(prisma, { name, quantity, categories });
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
 * @returns {Promise<Product>} - Returns the update product
 */
const updateProduct = (prisma, { id, name, quantity, categories }) => {
    return updateProductPrisma(prisma, { id, name, quantity, categories });
};
/**
 * Adds a image url to the list of images of the product
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: number, url: string}} object - Object with product id and image url
 * @returns {Promise<Product>} - Return the updated product
 */
const addImageUrlToProduct = (prisma, { id, url }) => {
    return updateProductPrisma(prisma, { id, url });
};

module.exports = {
    createProduct,
    deleteProducts,
    getProductById,
    getAllProducts,
    updateProduct,
    addImageUrlToProduct
};
