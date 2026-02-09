Design rationale
================

Why these resources
- The chosen resources (products, customers, carts, orders, reviews) map directly to core e-commerce nouns and cover the main flows: browsing, cart management, checkout, and post-purchase interactions.

PUT vs PATCH
- `PUT` is used for full replacement endpoints (e.g., updating a product record completely). `PATCH` is used for partial updates where only specific fields change (e.g., order status, customer contact info). This gives clear semantics to clients about idempotency and payload expectations.

Avoiding breaking clients
- Maintain backward compatibility by adding new optional fields rather than changing or removing existing fields.
- Use `PATCH` for additive changes and introduce versioning via the URL (e.g., `/v1/...`) when incompatible changes are required.
- Keep error formats stable and document all enum values (order statuses, payment methods).

Tradeoff made
- Chose offset pagination (`page`/`limit`) for simplicity and easier client implementation at the cost of potential inefficiency for very large collections — acceptable for this project's scope.
