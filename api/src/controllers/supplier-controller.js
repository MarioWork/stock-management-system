const {
    createSupplier: createSupplierPrisma,
    getAllSuppliers: getAllSuppliersPrisma,
    getSupplierById: getSupplierByIdPrisma,
    updateSupplier: updateSupplierPrisma,
    deleteSuppliers: deleteSuppliersPrisma,
    getAllSupplierProducts: getAllSupplierProductsPrisma
} = require('../services/prisma/supplier-service');

//TODO: add docs
const createSupplier = (prisma, { nif, name, createdBy }) =>
    createSupplierPrisma(prisma, { nif, name, createdBy });

//TODO: add docs
const getAllSuppliers = (prisma, { filter, pagination }) =>
    getAllSuppliersPrisma(prisma, { filter, pagination });

//TODO: add docs
const getSupplierById = (prisma, id) => getSupplierByIdPrisma(prisma, id);

//TODO: add docs
const updateSupplier = (prisma, { id, name, nif }) =>
    updateSupplierPrisma(prisma, { id, name, nif });

//TODO: add docs
const deleteSuppliers = (prisma, ids) => deleteSuppliersPrisma(prisma, ids);

//TODO: add docs
const getAllSupplierProducts = async (prisma, { id, pagination }) => {
    const [result, total] = await getAllSupplierProductsPrisma(prisma, { id, pagination });

    return [result?.products ?? [], total];
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSuppliers,
    getAllSupplierProducts
};
