# Products API

### Product

- - [x] /product/list - GET - returns all products
  - Query Params -> 'query' - Optional - to filter the products name
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

### Users

- - [x] /users/list - GET - List all users
  - Query Params -> 'role' - Optional - to filter users by role
- - [ ] /users/:id/ - GET - Get user by id
- - [ ] /users/:id - DELETE - Remove User

### Future features

- - [x] <s>Authentication with firebase</s>
- - [x] <s>Add users with roles table</s>
- - [x] <s>Add user profile picture</s>
- - [x] <s>Role check for certain routes</s>
- - [x] <s>Add schema for query params && path params</s>
- - [ ] More filter options to product
- - [ ] Pagination
- - [ ] Add product supplier table
- - [ ] Add more fields to product (supplier, code/barcode identifier, user who created, brand, description)
- - [ ] Add more fields to category (user who created)
- - [ ] Add order options to get queries
- - [ ] Add more filtering options to product
