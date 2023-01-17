const createCategory = (prisma, newCategory) => {
    const { name } = newCategory;

    return prisma.category.create({
        data: {
            name
        }
    });
};

const getAllCategories = prisma => {
    return prisma.category.findMany();
};

const getCategoryById = async (prisma, id) => {
    return prisma.category.findUnique({
        where: {
            id: id
        }
    });
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById
};
