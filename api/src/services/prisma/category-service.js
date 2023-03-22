/**
 * @typedef { import("../../types/prisma-docs-type") } PrismaClient
 * @typedef { import("../../types/prisma-docs-type") } Category
 * @typedef { import("../../types/pagination-docs-type") } Pagination
 * @typedef { import("../../types/sorting-docs-type") } Sorting
 */

/**
 * Creates a category with the given params
 * @param {PrismaClient} prisma - RM Dependency
 * @param {{name: string, createdBy: string} } Object - Object that represents the category to be added
 * @returns {Promise<Category>} - Promise object that returns the created category or error
 * @throws {error}
 */
const createCategory = (prisma, { name, createdBy }) => {
    const select = {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
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
        }
    };

    return prisma.category.create({
        data: {
            name,
            createdBy: {
                connect: {
                    id: createdBy
                }
            }
        },
        select
    });
};

/** Retrieves all categories
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{pagination: Pagination, sorting: Sorting}} - Data
 * @returns {Promise<{}[]>} - Promise object that returns array with categories and categories count
 * @throws {error}
 */
const getAllCategories = (prisma, { pagination, sorting }) => {
    const select = {
        id: true,
        name: true,
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
        }
    };

    const orderBy = !sorting.sort ? {} : { [sorting.sort]: sorting.order };

    return Promise.all([
        prisma.category.findMany({
            take: pagination.pageSize,
            skip: pagination.pastRecordsCount,
            select,
            orderBy
        }),
        prisma.category.count()
    ]);
};

/**
 * Retrieves a category by the Id given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number} id - Id of the category to retrieve
 * @returns {Promise<Category>} - Promise object that returns category or error
 * @throws {error}
 */
const getCategoryById = async (prisma, id) => {
    const select = {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
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
        }
    };

    return prisma.category.findUnique({
        where: {
            id
        },
        select
    });
};

/**
 * Update Category by id
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {Category} Object - Category Object
 * @returns {Promise<Category>} - Updated Category
 * @throws {error}
 */
const updateCategory = (prisma, { id, name }) => {
    const select = {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
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
        }
    };

    return prisma.category.update({
        where: {
            id
        },
        data: {
            name
        },
        select
    });
};

/**
 * Delete categories by its ids
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Ids of the categories to be deleted
 * @returns {Promise<{count: number}>} - Number of categories deleted
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
