/**
 * Creates a category with the given params
 * @param {import('@prisma/client').PrismaClient} prisma - ORM Dependency
 * @param {{name: string} } newCategory - Object that represents the category to be added
 * @returns {Promise.<import('@prisma/client').Category | error>} - Promise object that returns the created category or error
 * @throws
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
 * @param {import('@prisma/client').PrismaClient} prisma - ORM Dependency
 * @returns {Promise.<import('@prisma/client').Category[] | error>} - Promise object that returns array of categories or error
 * @throws
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
 * @param {import('@prisma/client').PrismaClient} prisma - ORM Dependency
 * @param {number} id - Id of the category to retrieve
 * @returns {Promise.<import('@prisma/client').Category | error>} - Promise object that returns category or error
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
