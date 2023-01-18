const getProductById = (prisma, id) => {
    return prisma.product.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            quantity: true,
            categories: { select: { id: true, name: true } }
        }
    });
};

const getAllProducts = prisma => {
    return prisma.product.findMany({
        select: {
            id: true,
            name: true,
            quantity: true,
            categories: { select: { id: true, name: true } }
        }
    });
};

const createProduct = (prisma, { name, quantity, categories }) => {
    return prisma.product.create({
        data: {
            name,
            quantity,
            categories: { connect: categories }
        },
        select: {
            id: true,
            name: true,
            quantity: true,
            categories: { select: { id: true, name: true } }
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
    deleteProducts,
    getProductById,
    getAllProducts
};
