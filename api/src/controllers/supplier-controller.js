const {
    createSupplier: createSupplierPrisma,
    getAllSuppliers: getAllSuppliersPrisma,
    getSupplierById: getSupplierByIdPrisma,
    updateSupplier: updateSupplierPrisma,
    deleteSuppliers: deleteSuppliersPrisma
} = require('../services/prisma/supplier-service');

//TODO: add docs
const createSupplier = (prisma, { nif, name }) => createSupplierPrisma(prisma, { nif, name });

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

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSuppliers
};
