//TODO: add docs
const getAllSuppliers = prisma => prisma.supplier.findMany();

//TODO: add docs
const getSupplierById = (prisma, id) => prisma.supplier.findUnique({ where: { id } });

//TODO: add docs
const updateSupplier = (prisma, { id, name, nif }) =>
    prisma.supplier.update({ where: { id }, data: { name, nif } });

//TODO: add docs
const deleteSuppliers = (prisma, ids) => prisma.supplier.deleteMany({ where: { id: { in: ids } } });

module.exports = {
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSuppliers
};
