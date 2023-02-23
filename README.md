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

- - [x] /users/list - GET - List all users
  - Query Params:
    - 'role' - Optional - to filter users by role
    - 'filter' - Optional - searches users by the filter in the fields (firstName, lastName, nif, email)
- - [x] /users/:id/ - GET - Get user by id
- - [x] /users/:id - DELETE - Remove User

### Suppliers

- - [ ] /supplier/list - GET - List all suppliers
- - [ ] /supplier/ - POST - Create Supplier
- - [ ] /supplier/:id - GET - Get supplier by id
- - [ ] /supplier/:id - PATCH - Update supplier by id
- - [ ] /supplier/:id - DELETE - DELETE supplier by id

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
- - [ ] More filter options to category
- - [ ] Add more fields to product (supplier, code/barcode identifier, user who created, brand, description)
- - [ ] Add more fields to category (user who created)
- - [ ] Add order options to get queries
- - [ ] Fix schemas required in routes instead of dynamic schemas
