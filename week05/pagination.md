Pagination & filtering
======================

Supported endpoints
- GET /products
- GET /orders
- GET /customers (admin)

Pagination method
- page & limit (offset-based)

Example query parameters
- `?page=1&limit=20` — page number and page size
- `?page=2&limit=50&sort=price:asc` — sort by price ascending
- `?page=1&limit=25&category=apparel&minPrice=10&maxPrice=100` — filters

Response shape (example)
{
  "meta": { "page": 1, "limit": 20, "total": 425 },
  "data": [ /* resource objects */ ]
}

Notes
- Use sensible default `limit=20` and maximum `limit=100` to avoid excessive payloads.
- For high-scale or real-time feeds consider cursor-based pagination in a later version.
