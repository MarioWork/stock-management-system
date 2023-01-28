/**
 * @typedef { import("../../types/prisma-docs-type") } PrismaClient
 * @typedef { import('../../types/category-docs-type') } Category
 * @typedef { import('../../types/product-docs-type') } Product
 */

/**
 * Retrieves a product by Id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number} id - Id of the product to retrieve
 * @returns {Promise<Product>} - Promise object that returns product or error
 * @throws {error}
 */
const getProductById = (prisma, id) => {
    return prisma.product.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            quantity: true,
            images: true,
            categories: { select: { id: true, name: true } }
        }
    });
};

/**
 * Retrieves all products
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} query - text to search with
 * @returns {Promise<Product[]>} - Promise object that returns product array or error
 * @throws {error}
 */
const getAllProducts = (prisma, query) => {
    return prisma.product.findMany({
        where: {
            name: {
                contains: query,
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            name: true,
            quantity: true,
            images: true,
            categories: { select: { id: true, name: true } }
        }
    });
};

/** TODO: Update docs
 * Creates a product with the properties given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{name: string, quantity: number, categories: {id: number}[]}} object - Object represents the product to create
 * @returns {Promise<Product>} - Promise object that returns product or error
 * @throws {error}
 */
const createProduct = (prisma, { name, quantity, categories, url }) => {
    return prisma.product.create({
        data: {
            name,
            quantity,
            url,
            categories: { connect: categories }
        },
        select: {
            id: true,
            name: true,
            quantity: true,
            images: true,
            categories: { select: { id: true, name: true } }
        }
    });
};

/**
 * Deletes products by the ids given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Ids of the products to be deleted
 * @returns {{count:number}} - Object with count property represents number of products deleted
 * @throws {error}
 */
const deleteProducts = (prisma, ids) => {
    return prisma.product.deleteMany({
        where: {
            id: { in: ids }
        }
    });
};

/**
 * Updates the category based on the properties given
 * Does not need all properties but, needs at least one (name, quantity, categories, url)
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: number,quantity: number=, categories: Category[]=, url: string=}} object - Object that represents what data to update
 * @returns {Promise<Product>} - Returns the update product
 */
const updateProduct = (prisma, { id, name, quantity, categories, url }) => {
    return prisma.product.update({
        where: { id },
        data: {
            name,
            quantity,
            categories: { connect: categories },
            images: { push: url }
        },
        select: {
            id: true,
            name: true,
            quantity: true,
            images: true,
            categories: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
};

module.exports = {
    createProduct,
    deleteProducts,
    getProductById,
    getAllProducts,
    updateProduct
};
