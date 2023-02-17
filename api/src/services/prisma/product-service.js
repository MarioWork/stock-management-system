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
 * @param {string} filter - text to search with
 * @returns {Promise<Product[]>} - Promise object that returns product array or error
 * @throws {error}
 */
//TODO: Fix docs
const getAllProducts = (prisma, { filter, pagination }) => {
    const where = {
        name: {
            contains: filter,
            mode: 'insensitive'
        }
    };

    return Promise.all([
        prisma.product.findMany({
            where,
            take: pagination.querySize,
            skip: pagination.recordsToSkip,
            select: {
                id: true,
                name: true,
                quantity: true,
                images: true,
                categories: { select: { id: true, name: true } }
            }
        }),
        prisma.product.count({ where })
    ]);
};

/**
 * Creates a product with the properties given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{name: string, quantity: number=, categories: {id: number}[]=}} object - Object represents the product to create
 * @returns {Promise<Product>} - Promise object that returns product or error
 * @throws {error}
 */
const createProduct = (prisma, { name, quantity, categories }) => {
    return prisma.product.create({
        data: {
            name,
            quantity,
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
 * @param {{id: number,quantity: number=, categories: {id: number}[]=, url: string=}} object - Object that represents what data to update
 * @returns {Promise<Product>} - Returns the update product
 */
const updateProduct = (prisma, { id, name, quantity, categories }) => {
    return prisma.product.update({
        where: { id },
        data: {
            name,
            quantity,
            categories: { connect: categories }
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

/**
 * Creates a file entry in database and connects it to product
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{productId: number, fileId: string, fileType: string, fileUrl: string}} object - Object that represents what data to update and what product to update
 * @returns {Promise<Product>} - Returns the update product with the new file
 * @throws {error}
 */
const addImageToProduct = (prisma, { productId, fileId, fileType, fileUrl }) => {
    return prisma.product.update({
        where: { id: productId },
        data: {
            images: {
                connectOrCreate: {
                    where: { id: fileId },
                    create: {
                        id: fileId,
                        url: fileUrl,
                        type: fileType
                    }
                }
            }
        },
        select: {
            id: true,
            name: true,
            quantity: true,
            images: {
                select: { id: true, url: true }
            },
            categories: { select: { id: true, name: true } }
        }
    });
};

/**
 * Checks if a product exists with a quick query
 * that only returns the id if it was found
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number} id - Product id
 * @returns {id: number} - Product id if exists
 * @throws {error}
 */
const productExists = (prisma, id) => {
    return prisma.product.findUnique({
        where: { id },
        select: { id: true }
    });
};

module.exports = {
    createProduct,
    deleteProducts,
    getProductById,
    getAllProducts,
    updateProduct,
    productExists,
    addImageToProduct
};
