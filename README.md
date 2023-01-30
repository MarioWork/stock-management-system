# Products API

### Product

-   -   [x] /product/list - GET - returns all products
    - Query Params -> 'query' - Optional - to filter the products name
-   -   [x] /product/:id - GET - returns a single product
-   -   [x] /product/:id - DELETE - removes a product
-   -   [x] /product/:id - PATCH - updates a product
-   -   [x] /product/ - POST - creates a product
-   -   [x] /product/image - POST - add image to cloud bucket and connect url to product

#

### Category

-   -   [x] /category/list - GET - returns all categories
-   -   [x] /category/:id - GET - returns a single category
-   -   [x] /category/:id - PATCH - update a category
-   -   [x] /category/:id - DELETE - removes a category
-   -   [x] /category/ - POST - creates a category

#

### Image

- - [x] /image/:id - GET - returns a image by id
  - Query Params -> 'type' - Required - The image type (ex: png)
- - [x] /image/:id - DELETE - removes a image by id

#

### Future features

- - [ ] Authentication with fireabase 
- - [ ] Role check for certain routes
- - [ ] Pagination
- - [ ] Add product supplier table
- - [ ] Add staff / roles table
