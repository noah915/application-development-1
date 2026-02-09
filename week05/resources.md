Resources
=========

Resource: products
Endpoint: /products/{productId}
Related: /products/{productId}/reviews

Resource: customers
Endpoint: /customers/{customerId}
Related: /customers/{customerId}/orders

Resource: orders
Endpoint: /orders/{orderId}
Related: /orders/{orderId}/items

Resource: carts
Endpoint: /carts/{cartId}
Related: /carts/{cartId}/items

Resource: reviews
Endpoint: /products/{productId}/reviews/{reviewId}
Related: /products/{productId}
