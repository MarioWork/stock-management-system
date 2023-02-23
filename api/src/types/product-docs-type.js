/**
 * @typedef {import("../types/supplier-docs-type")} Supplier
 * @typedef {import("../types/user-docs-type")} User
 * @typedef {import("../types/category-docs-type")} Category
 */

/**
 * @typedef {{
 *  id: string,
 *  name: string,
 *  description: string,
 *  quantity: number,
 *  images: string[],
 *  categories: Category[],
 *  upc: string,
 *  createdBy: User,
 *  supplier: Supplier,
 *  createdAt: Date,
 *  updatedAt: Date
 * }} Product
 */
