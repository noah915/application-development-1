API Endpoints (core)
=====================

Products
--------
- GET /products
  - Purpose: Return paginated product collection
  - Returns: 200 OK
- GET /products/{productId}
  - Purpose: Return single product
  - Returns: 200 OK
- POST /products
  - Purpose: Create a product (admin)
  - Returns: 201 Created
- PUT /products/{productId}
  - Purpose: Replace product (full update)
  - Returns: 200 OK
- DELETE /products/{productId}
  - Purpose: Delete a product
  - Returns: 204 No Content

Customers
---------
- GET /customers
  - Purpose: Return customer list (admin) - paginated
  - Returns: 200 OK
- GET /customers/{customerId}
  - Purpose: Retrieve a customer profile
  - Returns: 200 OK
- POST /customers
  - Purpose: Register a new customer
  - Returns: 201 Created
- PATCH /customers/{customerId}
  - Purpose: Partial update to customer (address, phone)
  - Returns: 200 OK
- DELETE /customers/{customerId}
  - Purpose: Deactivate or delete customer (admin or self)
  - Returns: 204 No Content

Carts
-----
- GET /carts/{cartId}
  - Purpose: Retrieve cart contents
  - Returns: 200 OK
- POST /carts
  - Purpose: Create a new cart
  - Returns: 201 Created
- POST /carts/{cartId}/items
  - Purpose: Add item to cart
  - Returns: 201 Created
- PATCH /carts/{cartId}/items/{itemId}
  - Purpose: Update item quantity
  - Returns: 200 OK
- DELETE /carts/{cartId}/items/{itemId}
  - Purpose: Remove item from cart
  - Returns: 204 No Content

Orders
------
- GET /orders
  - Purpose: Return orders (customer or admin) - paginated
  - Returns: 200 OK
- GET /orders/{orderId}
  - Purpose: Retrieve order details
  - Returns: 200 OK
- POST /orders
  - Purpose: Create an order from a cart / checkout
  - Returns: 201 Created
- PATCH /orders/{orderId}
  - Purpose: Partial updates (status changes, tracking number)
  - Returns: 200 OK
- DELETE /orders/{orderId}
  - Purpose: Cancel an order (if allowed)
  - Returns: 204 No Content

Reviews
-------
- GET /products/{productId}/reviews
  - Purpose: List reviews for a product
  - Returns: 200 OK
- POST /products/{productId}/reviews
  - Purpose: Create a review for a product
  - Returns: 201 Created
- DELETE /products/{productId}/reviews/{reviewId}
  - Purpose: Delete a review (owner or moderator)
  - Returns: 204 No Content
