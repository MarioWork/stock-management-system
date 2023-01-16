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
    const x = await prisma.category.findUnique({
        where: {
            id: id
        }
    });

    return x;
};

module.exports = { createCategory, getAllCategories, getCategoryById };
