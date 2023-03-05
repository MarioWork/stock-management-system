# Products API

### Product

- - [x] /product/list - GET - returns all products
  - Query Params:
    - 'filter' - Optional - searches products by the filter in the fields (name)
    - 'categoryId' - Optional - to filter products by category
- - [x] /product/:id - GET - returns a single product
- - [x] /product/:id - DELETE - removes a product
- - [x] /product/:id - PATCH - updates a product
- - [x] /product/ - POST - creates a product
- - [x] /product/image - POST - add image to cloud bucket and connect url to product

#

### Category

- - [x] /category/list - GET - returns all categories
- - [x] /category/:id - GET - returns a single category
- - [x] /category/:id - PATCH - update a category
- - [x] /category/:id - DELETE - removes a category
- - [x] /category/ - POST - creates a category

#

### Image

- - [x] /image/:id - GET - returns a image by id
- - [x] /image/:id - DELETE - removes a image by id

#

### Auth

- - [x] /auth/signup/employee - POST - create a user with the "employee" role

#

### Me

- - [x] /me/picture - POST - Add user profile picture

#

### Users

- - [x] /user/list - GET - List all users
  - Query Params:
    - 'role' - Optional - to filter users by role
    - 'filter' - Optional - searches users by the filter in the fields (firstName, lastName, nif, email)
- - [x] /user/:id/ - GET - Get user by id
- - [x] /user/:id - DELETE - Remove User
- - [x] /user/:id/product/list - GET - List all products created by the user
- - [x] /user/:id/category/list - GET - List all categories created by the user
- - [x] /user/:id/supplier/list - GET - List all suppliers created by the user
- - [x] /user/:id/role/list - GET - List all user roles

#

### Suppliers

- - [x] /supplier/list - GET - List all suppliers
- - [x] /supplier/ - POST - Create Supplier
- - [x] /supplier/:id - GET - Get supplier by id
- - [x] /supplier/:id - PATCH - Update supplier by id
- - [x] /supplier/:id - DELETE - Delete supplier by id
- - [x] /supplier/:id/product/list - GET - List all products from supplier

#

### Features

- - [x] <s>Authentication with firebase</s>
- - [x] <s>Add users with roles table</s>
- - [x] <s>Add user profile picture</s>
- - [x] <s>Role check for certain routes</s>
- - [x] <s>Add schema for query params && path params</s>
- - [x] <s>Pagination</s>
- - [x] <s>Centralize schemas (params/query/body should use the proper schema from userId etc instead always creating the same schema multiple times)</s>
- - [x] <s>More filter options to product</s>
- - [x] <s>Add product supplier table</s>
- - [x] <s>Add more fields to product (supplier, code/barcode identifier, user who created, brand, description)</s>
- - [x] <s>Add more fields to category (user who created)</s>
- - [x] <s>Add more pagination metadata (firstPage, lastPage)</s>
- - [x] <s>Add to list routes pagination schema query</s>
- - [x] <s>Finish routes</s>
- - [ ] Add authorization schema like post employee to others
- - [ ] error handling for unique fields prisma P2002
- - [ ] Remove cascade deleting
- - [ ] More filter options to category
- - [ ] Add order options to get queries
- - [ ] Fix schemas required in routes instead of dynamic schemas
- - [ ] Add createdBy to file and user
