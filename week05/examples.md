Examples (requests & responses)
================================

1) POST /products  — Create a product

Request (example):
POST /products
Content-Type: application/json

{
  "sku": "TSHIRT-RED-001",
  "name": "Red T-Shirt",
  "description": "100% cotton, unisex",
  "price": 19.99,
  "inventory": 50,
  "categories": ["apparel","sale"]
}

Response (201 Created):
{
  "id": "prod_12345",
  "sku": "TSHIRT-RED-001",
  "name": "Red T-Shirt",
  "price": 19.99,
  "inventory": 50
}

2) GET /products?page=1&limit=2 — Paginated products

Request:
GET /products?page=1&limit=2

Response (200 OK):
{
  "meta": { "page": 1, "limit": 2, "total": 125 },
  "data": [
    { "id": "prod_12345", "name": "Red T-Shirt", "price": 19.99 },
    { "id": "prod_67890", "name": "Blue Jeans", "price": 49.5 }
  ]
}

3) POST /orders — Create an order (checkout)

Request:
POST /orders
Content-Type: application/json

{
  "customerId": "cust_987",
  "items": [ { "productId": "prod_12345", "quantity": 2 } ],
  "shippingAddress": { "line1": "1 Main St", "city": "Anytown", "postalCode": "12345" },
  "paymentMethod": "card_abc123"
}

Response (201 Created):
{
  "id": "ord_555",
  "status": "pending",
  "total": 39.98,
  "items": [ { "productId": "prod_12345", "quantity": 2, "unitPrice": 19.99 } ]
}
