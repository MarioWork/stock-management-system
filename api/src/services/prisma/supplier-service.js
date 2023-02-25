//TODO: add docs
const createSupplier = (prisma, { nif, name }) => prisma.supplier.create({ data: { nif, name } });

//TODO: add docs
const getAllSuppliers = (prisma, { filter, pagination }) => {
    const where = {
        name: {
            contains: filter,
            mode: 'insensitive'
        }
    };
    return Promise.all([
        prisma.supplier.findMany({
            where,
            take: pagination.pageSize,
            skip: pagination.pastRecordsCount
        }),
        prisma.supplier.count({ where })
    ]);
};

//TODO: add docs
const getSupplierById = (prisma, id) => prisma.supplier.findUnique({ where: { id } });

//TODO: add docs
const updateSupplier = (prisma, { id, name, nif }) =>
    prisma.supplier.update({ where: { id }, data: { name, nif } });

//TODO: add docs
const deleteSuppliers = (prisma, ids) => prisma.supplier.deleteMany({ where: { id: { in: ids } } });

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSuppliers
};
