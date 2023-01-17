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

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory
};
