# Products API ( Still is development ... )

### Product

- - [x] /product/list - GET - returns all products (Paginated)
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

- - [x] /category/list - GET - returns all categories (Paginated)
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

### User

- - [x] /user/list - GET - List all users (Paginated)
  - Query Params:
    - 'role' - Optional - to filter users by role
    - 'filter' - Optional - searches users by the filter in the fields (firstName, lastName, nif, email)
- - [x] /user/:id/ - GET - Get user by id
- - [x] /user/:id - DELETE - Remove User
- - [ ] /user/:id - PATCH - Update user by id
- - [x] /user/:id/product/list - GET - List all products created by the user (Paginated)
- - [x] /user/:id/category/list - GET - List all categories created by the user (Paginated)
- - [x] /user/:id/supplier/list - GET - List all suppliers created by the user (Paginated)
- - [x] /user/:id/role/list - GET - List all user roles

#

### Supplier

- - [x] /supplier/list - GET - List all suppliers (Paginated)
- - [x] /supplier/ - POST - Create Supplier
- - [x] /supplier/:id - GET - Get supplier by id
- - [x] /supplier/:id - PATCH - Update supplier by id
- - [x] /supplier/:id - DELETE - Delete supplier by id
- - [x] /supplier/:id/product/list - GET - List all products from supplier (Paginated)
