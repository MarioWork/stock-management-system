/**
 * @typedef { import("../types/prisma-docs-type") } PrismaClient
 * @typedef { import("../types/prisma-docs-type") } Category
 * @typedef { import("../types/pagination-docs-type") } Pagination
 * @typedef { import("../types/sorting-docs-type") } Sorting
 */

const {
    createCategory: createCategoryPrisma,
    getAllCategories: getAllCategoriesPrisma,
    getCategoryById: getCategoryByIdPrisma,
    updateCategory: updateCategoryPrisma,
    deleteCategories: deleteCategoriesPrisma
} = require('../services/prisma/category-service');

/**
 * Creates a category with the given params
 * @param {PrismaClient} prisma - RM Dependency
 * @param {{name: string, createdBy: string} } Object - Object that represents the category to be added
 * @returns {Promise<Category>} - Promise object that returns the created category or error
 * @throws {error}
 */
const createCategory = (prisma, { name, createdBy }) =>
    createCategoryPrisma(prisma, { name, createdBy });

/** Retrieves all categories
 * @param {PrismaClient} prisma - ORM Dependency
 ** @param {{pagination: Pagination, sorting: Sorting}} - Data
 * @returns {Promise<{}[]>} - Promise object that returns array with categories and categories count
 * @throws {error}
 */
const getAllCategories = (prisma, { pagination, sorting }) =>
    getAllCategoriesPrisma(prisma, { pagination, sorting });

/**
 * Retrieves a category by the Id given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number} id - Id of the category to retrieve
 * @returns {Promise<Category>} - Promise object that returns category or error
 * @throws {error}
 */
const getCategoryById = (prisma, id) => getCategoryByIdPrisma(prisma, id);

/**
 * Update Category by id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {Category} Object - Category Object
 * @returns {Promise<Category>} - Updated Category
 * @throws {error}
 */
const updateCategory = (prisma, { id, name }) => updateCategoryPrisma(prisma, { id, name });

/**
 * Delete categories by its ids
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Ids of the categories to be deleted
 * @returns {Promise<{count: number}>} - Number of categories deleted
 */
const deleteCategories = (prisma, ids) => deleteCategoriesPrisma(prisma, ids);

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategories
};
