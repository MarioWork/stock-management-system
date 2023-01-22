/**
 * @typedef { import("@prisma/client").PrismaClient } PrismaClient
 * @typedef {{id: number, name: string}} Category
 */

/**
 * Creates a category with the given params
 * @param {PrismaClient} prisma - RM Dependency
 * @param {{name: string} } Object - Object that represents the category to be added
 * @returns {Promise<Category>} - Promise object that returns the created category or error
 * @throws {error}
 */
const createCategory = (prisma, newCategory) => {
    const { name } = newCategory;

    return prisma.category.create({
        data: {
            name
        },
        select: {
            id: true,
            name: true
        }
    });
};

/** Retrieves all categories
 * @param {PrismaClient} prisma - ORM Dependency
 * @returns {Promise<Category[]>} - Promise object that returns array of categories or error
 * @throws {error}
 */
const getAllCategories = prisma => {
    return prisma.category.findMany({
        select: {
            id: true,
            name: true
        }
    });
};

/**
 * Retrieves a category by the Id given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number} id - Id of the category to retrieve
 * @returns {Promise<Category>} - Promise object that returns category or error
 * @throws {error}
 */
const getCategoryById = async (prisma, id) => {
    return prisma.category.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true
        }
    });
};

/**
 * Update Category by id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {Category} Object - Category Object
 * @returns {Category} - Updated Category
 * @throws {error}
 */
const updateCategory = (prisma, { id, name }) => {
    return prisma.category.update({
        where: {
            id
        },
        data: {
            name
        }
    });
};

/**
 * Delete categories by its ids
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Ids of the categories to be deleted
 * @returns {{count: number}} - Number of categories deleted
 */
const deleteCategories = (prisma, ids) => {
    return prisma.category.deleteMany({
        where: {
            id: { in: ids }
        }
    });
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategories
};
