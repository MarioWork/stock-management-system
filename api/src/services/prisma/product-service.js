/**
 * @typedef { import("../../types/prisma-docs-type") } PrismaClient
 * @typedef { import('../../types/category-docs-type') } Category
 * @typedef { import('../../types/product-docs-type') } Product
 * @typedef { import('../../types/pagination-docs-type') } Pagination
 */

/**
 * Retrieves a product by Id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number} id - Id of the product to retrieve
 * @returns {Promise<Product>} - Promise object that returns product or error
 * @throws {error}
 */
const getProductById = (prisma, id) => {
    const select = {
        id: true,
        name: true,
        description: true,
        quantity: true,
        upc: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
            select: {
                id: true,
                nif: true,
                profilePicture: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true
            }
        },
        categories: { select: { id: true, name: true } },
        images: { select: { id: true, url: true } },
        supplier: { select: { id: true, name: true, nif: true } }
    };

    return prisma.product.findUnique({
        select,
        where: {
            id
        }
    });
};

/**
 * Retrieves all products
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{filter: string=, categoryId: string=, pagination: Pagination, supplierId: string=}} obj - Data
 * @returns {Promise} - Promise object that returns product array and count of records
 * @throws {error}
 */
const getAllProducts = (prisma, { filter, categoryId, pagination, supplierId }) => {
    const categoryWhereQuery = categoryId
        ? {
              categories: {
                  some: {
                      id: categoryId
                  }
              }
          }
        : {};

    const where = {
        AND: [
            {
                name: {
                    contains: filter,
                    mode: 'insensitive'
                }
            },
            categoryWhereQuery,
            {
                supplierId
            }
        ]
    };

    const select = {
        id: true,
        name: true,
        description: true,
        quantity: true,
        upc: true,
        categories: { select: { id: true, name: true } },
        createdBy: {
            select: {
                id: true,
                nif: true,
                profilePicture: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true
            }
        },
        images: { select: { url: true } },
        supplier: { select: { id: true } }
    };

    return Promise.all([
        prisma.product.findMany({
            where,
            take: pagination.pageSize,
            skip: pagination.pastRecordsCount,
            select
        }),
        prisma.product.count({ where })
    ]);
};

/**
 * Creates a product with the properties given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{
 *  name: string,
 *  description: string,
 *  quantity: number,
 *  categories: number[],
 *  supplier: string,
 *  upc: string,
 *  createdBy: string
 * }} object - Object represents the product to create * @returns {Promise<Product>} - Promise object that returns product or error
 * @throws {error}
 */
const createProduct = (
    prisma,
    { name, description, quantity, categories, supplier, upc, createdBy }
) => {
    const select = {
        id: true,
        name: true,
        description: true,
        quantity: true,
        upc: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
            select: {
                id: true,
                nif: true,
                profilePicture: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true
            }
        },
        categories: { select: { id: true, name: true } },
        images: true,
        supplier: true
    };

    return prisma.product.create({
        data: {
            name,
            description,
            quantity,
            upc,
            categories: { connect: categories },
            supplier: {
                connect: { id: supplier }
            },
            createdBy: {
                connect: { id: createdBy }
            }
        },
        select
    });
};

/**
 * Deletes products by the ids given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Ids of the products to be deleted
 * @returns {{count:number}} - Object with count property represents number of products deleted
 * @throws {error}
 */
const deleteProducts = (prisma, ids) =>
    prisma.product.deleteMany({
        where: {
            id: { in: ids }
        }
    });

/**
 * Updates the category based on the properties given
 * Does not need all properties but, needs at least one (name, quantity, categories, url)
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{
 *  name: string,
 *  description: string,
 *  quantity: number,
 *  categories: number[],
 *  supplier: string,
 *  upc: string,
 *  createdBy: string
 * }} object - Object represents the product to update
 * @returns {Promise<Product>} - Returns the update product
 */
const updateProduct = (prisma, { id, name, quantity, categories, supplier, upc, description }) => {
    const select = {
        id: true,
        name: true,
        description: true,
        quantity: true,
        upc: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
            select: {
                id: true,
                nif: true,
                profilePicture: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true
            }
        },
        categories: { select: { id: true, name: true } },
        images: { select: { id: true, url: true } },
        supplier: { select: { id: true, name: true, nif: true } }
    };

    return prisma.product.update({
        where: { id },
        data: {
            name,
            quantity,
            description,
            upc,
            categories: { connect: categories },
            supplierId: supplier
        },
        select
    });
};

/**
 * Creates a file entry in database and connects it to product
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{productId: number, fileId: string, fileType: string, fileUrl: string, createdBy: string}} object - Object that represents what data to update and what product to update
 * @returns {Promise<Product>} - Returns the update product with the new file
 * @throws {error}
 */
const addImageToProduct = (prisma, { productId, fileId, fileType, fileUrl, createdBy }) => {
    const select = {
        id: true,
        name: true,
        description: true,
        quantity: true,
        upc: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
            select: {
                id: true,
                nif: true,
                profilePicture: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true
            }
        },
        categories: { select: { id: true, name: true } },
        images: { select: { id: true, url: true } },
        supplier: { select: { id: true, name: true, nif: true } }
    };

    return prisma.product.update({
        where: { id: productId },
        data: {
            images: {
                connectOrCreate: {
                    where: { id: fileId },
                    create: {
                        id: fileId,
                        url: fileUrl,
                        type: fileType,
                        createdByUserId: createdBy
                    }
                }
            }
        },
        select
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
