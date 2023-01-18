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

const getAllCategories = prisma => {
    return prisma.category.findMany({
        select: {
            id: true,
            name: true
        }
    });
};

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

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory
};
