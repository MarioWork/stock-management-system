const AllowedCategorySortingFields = ['name', 'createdAt', 'updatedAt'];

const AllowedProductSortingFields = [
    'name',
    'upc',
    'description',
    'createdAt',
    'updatedAt',
    'quantity'
];

const AllowedUserSortingFields = [
    'firstName',
    'lastName',
    'nif',
    'email',
    'updatedAt',
    'createdAt'
];

const AllowedSupplierSortingFields = ['name', 'nif', 'createAt', 'updatedAt'];

module.exports = {
    AllowedCategorySortingFields,
    AllowedProductSortingFields,
    AllowedSupplierSortingFields,
    AllowedUserSortingFields
};
