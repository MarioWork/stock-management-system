const createProduct = (prisma, { name, quantity, categories }) => {
    return prisma.product.create({
        data: {
            name,
            quantity,
            categories: { connect: categories }
        }
    });
};

const addCategoriesToProduct = (prisma, { id, categories }) => {
    return prisma.product.update({
        where: { id },
        data: {
            categories: { connect: categories }
        }
    });
};

const deleteProducts = (prisma, ids) => {
    return prisma.product.deleteMany({
        where: {
            id: { in: ids }
        }
    });
};

module.exports = {
    createProduct,
    addCategoriesToProduct,
    deleteProducts
};
