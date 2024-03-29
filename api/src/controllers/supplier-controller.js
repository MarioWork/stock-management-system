/**
 * @typedef { import('../types/prisma-docs-type') } PrismaClient
 * @typedef { import('../types/pagination-docs-type') } Pagination
 * @typedef { import('../types/sorting-docs-type') } Sorting
 * @typedef { import('../types/product-docs-type') } Product
 */

const {
    createSupplier: createSupplierPrisma,
    getAllSuppliers: getAllSuppliersPrisma,
    getSupplierById: getSupplierByIdPrisma,
    updateSupplier: updateSupplierPrisma,
    deleteSuppliers: deleteSuppliersPrisma,
    getAllSupplierProducts: getAllSupplierProductsPrisma
} = require('../services/prisma/supplier-service');

/**
 * Creates a supplier with the given data and returns the created supplier
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: string, name: string, createdBy: string}} - Data
 * @returns {Promise}
 * @throws {error}
 */
const createSupplier = (prisma, { nif, name, createdBy }) =>
    createSupplierPrisma(prisma, { nif, name, createdBy });

/**
 * Returns all suppliers paginated with the filter given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{filter: string=, pagination: Pagination, sorting: Sorting}} obj - Data
 * @returns {Promise}
 * @throws {error}
 */
const getAllSuppliers = (prisma, { filter, pagination, sorting }) =>
    getAllSuppliersPrisma(prisma, { filter, pagination, sorting });

/**
 * Returns a supplier by the given ID
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - Supplier ID
 * @returns {promise}
 * @throws {error}
 */
const getSupplierById = (prisma, id) => getSupplierByIdPrisma(prisma, id);

/**
 * Updates supplier with given data
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: string, name: string=, nif: string=}} obj - Data
 * @returns {Promise}
 * @throws {error}
 */
const updateSupplier = (prisma, { id, name, nif }) =>
    updateSupplierPrisma(prisma, { id, name, nif });

/**
 * Deletes the suppliers with ids given and returns the count of deleted records
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Array of ids to delete
 * @returns {Promise}
 * @throws {error}
 */
const deleteSuppliers = (prisma, ids) => deleteSuppliersPrisma(prisma, ids);

/**
 * Returns all products of a certain supplier paginated and the total amount of records
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: string, pagination: Pagination}} obj
 * @returns {[products: Product[],total: number]}
 * @throws {error}
 */
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
