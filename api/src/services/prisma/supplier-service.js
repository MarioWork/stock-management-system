/**
 * @typedef { import('../../types/prisma-docs-type') } PrismaClient
 * @typedef { import('../../types/pagination-docs-type') } Pagination
 */

//TODO: add docs
const createSupplier = (prisma, { nif, name, createdBy }) =>
    prisma.supplier.create({ data: { nif, name, createdBy: { connect: { id: createdBy } } } });

/**
 * Returns all suppliers paginated with the filter given
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{filter: string=, pagination: Pagination}} obj - Data
 * @returns {Promise}
 * @throws {error}
 */
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

/**
 * Returns a supplier by the given ID
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {string} id - Supplier ID
 * @returns {Promise}
 * @throws {error}
 */
const getSupplierById = (prisma, id) => prisma.supplier.findUnique({ where: { id } });

/**
 * Updates supplier with given data
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: string, name: string=, nif: string=}} obj - Data
 * @returns {Promise}
 * @throws {error}
 */
const updateSupplier = (prisma, { id, name, nif }) =>
    prisma.supplier.update({ where: { id }, data: { name, nif } });

/**
 * Deletes the suppliers with ids given and returns the count of deleted records
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {number[]} ids - Array of ids to delete
 * @returns {Promise}
 * @throws {error}
 */
const deleteSuppliers = (prisma, ids) => prisma.supplier.deleteMany({ where: { id: { in: ids } } });

/**
 * Returns all products of a certain supplier paginated and the total amount of records
 * @param {PrismaClient} prisma - ORM Dependency
 * @param {{id: string, pagination: Pagination}} obj
 * @returns {Promise}
 * @throws {error}
 */
const getAllSupplierProducts = (prisma, { id, pagination }) => {
    const select = {
        id: true,
        name: true,
        quantity: true,
        images: {
            select: { url: true }
        },
        categories: { select: { id: true, name: true } }
    };

    return Promise.all([
        prisma.supplier.findUnique({
            where: { id },
            select: {
                products: {
                    select,
                    take: pagination.pageSize,
                    skip: pagination.pastRecordsCount
                }
            }
        }),
        prisma.product.count({ where: { supplierId: id } })
    ]);
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSuppliers,
    getAllSupplierProducts
};
