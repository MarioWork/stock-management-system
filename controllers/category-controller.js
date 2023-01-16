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

module.exports = { createCategory, getAllCategories };
