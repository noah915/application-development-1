# API Documentation

Complete endpoint reference for the Task Management API.

---

## Tasks Resource `/tasks`

### GET /tasks
Retrieve all tasks.

**Method**: `GET`

**Headers**:
- None required

**Request Body**: None

**Success Response** (200 OK)
```json
[
  {
    "id": "1",
    "title": "Complete assignment",
    "description": "Finish the middleware assignment",
    "completed": false
  },
  {
    "id": "2",
    "title": "Code review",
    "description": "Review pull requests",
    "completed": true
  }
]
```

**Possible Error Responses**: None (always succeeds)

---

### GET /tasks/:id
Retrieve a specific task by ID.

**Method**: `GET`

**URL Parameters**:
- `id` (string, required) - The task ID

**Headers**:
- None required

**Request Body**: None

**Success Response** (200 OK)
```json
{
  "id": "1",
  "title": "Complete assignment",
  "description": "Finish the middleware assignment",
  "completed": false
}
```

**Error Response** (404 Not Found)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task 999 not found"
  }
}
```

---

### POST /tasks
Create a new task.

**Method**: `POST`

**Headers**:
- `Content-Type: application/json` (required)
- `x-api-key: 12345` (required)

**Request Body**:
```json
{
  "title": "Learn Express.js",
  "description": "Study the Express.js framework",
  "completed": false
}
```

**Request Body Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | Non-empty string, required |
| description | string | No | String, defaults to empty string |
| completed | boolean | No | Boolean, defaults to false |

**Success Response** (201 Created)
```json
{
  "id": "3",
  "title": "Learn Express.js",
  "description": "Study the Express.js framework",
  "completed": false
}
```

**Error Responses**:

**400 Bad Request** - Missing required field
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "'title' is required and must be a non-empty string"
  }
}
```

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

---

### PATCH /tasks/:id
Update an existing task.

**Method**: `PATCH`

**URL Parameters**:
- `id` (string, required) - The task ID

**Headers**:
- `Content-Type: application/json` (required)
- `x-api-key: 12345` (required)

**Request Body** (all fields optional):
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Request Body Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | No | Non-empty string if provided |
| description | string | No | String if provided |
| completed | boolean | No | Boolean if provided |

**Success Response** (200 OK)
```json
{
  "id": "1",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Error Responses**:

**400 Bad Request** - Invalid field format
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "'completed' must be a boolean"
  }
}
```

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**404 Not Found** - Task doesn't exist
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task 999 not found"
  }
}
```

---

### DELETE /tasks/:id
Delete a task.

**Method**: `DELETE`

**URL Parameters**:
- `id` (string, required) - The task ID

**Headers**:
- `x-api-key: 12345` (required)

**Request Body**: None

**Success Response** (204 No Content)
```
(empty body)
```

**Error Responses**:

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**404 Not Found** - Task doesn't exist
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task 999 not found"
  }
}
```

---

## Products Resource `/products`

### GET /products
List all products with optional pagination.

**Method**: `GET`

**Query Parameters**:
- `page` (number, optional) - Page number, defaults to 1
- `limit` (number, optional) - Items per page, defaults to 10

**Headers**:
- None required

**Request Body**: None

**Success Response** (200 OK)
```json
{
  "data": [
    {
      "id": "1",
      "name": "Wireless Mouse",
      "price": 29.99,
      "sku": "WMOUSE-001",
      "description": "Ergonomic wireless mouse"
    },
    {
      "id": "2",
      "name": "USB-C Cable",
      "price": 12.99,
      "sku": "USBCABLE-001",
      "description": "High-speed USB-C charging cable"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2
  }
}
```

**Error Response** (400 Bad Request) - Invalid pagination
```json
{
  "error": {
    "code": "INVALID_PAGINATION",
    "message": "Pagination must use positive integers for page and limit"
  }
}
```

---

### GET /products/:id
Retrieve a specific product.

**Method**: `GET`

**URL Parameters**:
- `id` (string, required) - The product ID

**Headers**:
- None required

**Request Body**: None

**Success Response** (200 OK)
```json
{
  "id": "1",
  "name": "Wireless Mouse",
  "price": 29.99,
  "sku": "WMOUSE-001",
  "description": "Ergonomic wireless mouse"
}
```

**Error Response** (404 Not Found)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product 999 not found"
  }
}
```

---

### POST /products
Create a new product.

**Method**: `POST`

**Headers**:
- `Content-Type: application/json` (required)
- `x-api-key: 12345` (required)

**Request Body**:
```json
{
  "name": "Mechanical Keyboard",
  "price": 149.99,
  "sku": "MECH-KB-001",
  "description": "Professional mechanical keyboard with RGB lighting"
}
```

**Request Body Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | Non-empty string, required |
| price | number | Yes | Must be positive number |
| sku | string | Yes | Non-empty string, must be unique |
| description | string | No | String, defaults to empty string |

**Success Response** (201 Created)
```json
{
  "id": "3",
  "name": "Mechanical Keyboard",
  "price": 149.99,
  "sku": "MECH-KB-001",
  "description": "Professional mechanical keyboard with RGB lighting"
}
```

**Error Responses**:

**400 Bad Request** - Missing required field
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "'price' must be a positive number"
  }
}
```

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**409 Conflict** - Duplicate SKU
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Product with sku 'WMOUSE-001' already exists"
  }
}
```

---

### PATCH /products/:id
Update an existing product.

**Method**: `PATCH`

**URL Parameters**:
- `id` (string, required) - The product ID

**Headers**:
- `Content-Type: application/json` (required)
- `x-api-key: 12345` (required)

**Request Body** (all fields optional):
```json
{
  "name": "Updated Product Name",
  "price": 99.99,
  "sku": "NEW-SKU-001",
  "description": "Updated description"
}
```

**Request Body Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | No | Non-empty string if provided |
| price | number | No | Positive number if provided |
| sku | string | No | Non-empty, unique string if provided |
| description | string | No | String if provided |

**Success Response** (200 OK)
```json
{
  "id": "1",
  "name": "Updated Product Name",
  "price": 99.99,
  "sku": "NEW-SKU-001",
  "description": "Updated description"
}
```

**Error Responses**:

**400 Bad Request** - Invalid field format
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "'price' must be a positive number"
  }
}
```

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**404 Not Found** - Product doesn't exist
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product 999 not found"
  }
}
```

**409 Conflict** - Duplicate SKU
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Product with sku 'EXISTING-SKU' already exists"
  }
}
```

---

### DELETE /products/:id
Delete a product.

**Method**: `DELETE`

**URL Parameters**:
- `id` (string, required) - The product ID

**Headers**:
- `x-api-key: 12345` (required)

**Request Body**: None

**Success Response** (204 No Content)
```
(empty body)
```

**Error Responses**:

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**404 Not Found** - Product doesn't exist
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product 999 not found"
  }
}
```

---

## Customers Resource `/customers`

### GET /customers
Retrieve all customers.

**Method**: `GET`

**Headers**:
- None required

**Request Body**: None

**Success Response** (200 OK)
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address": "123 Main St"
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "555-5678",
    "address": "456 Oak Ave"
  }
]
```

**Possible Error Responses**: None (always succeeds)

---

### GET /customers/:id
Retrieve a specific customer.

**Method**: `GET`

**URL Parameters**:
- `id` (string, required) - The customer ID

**Headers**:
- None required

**Request Body**: None

**Success Response** (200 OK)
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "address": "123 Main St"
}
```

**Error Response** (404 Not Found)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer 999 not found"
  }
}
```

---

### POST /customers
Create a new customer.

**Method**: `POST`

**Headers**:
- `Content-Type: application/json` (required)
- `x-api-key: 12345` (required)

**Request Body**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "555-9999",
  "address": "789 Pine Rd"
}
```

**Request Body Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | Non-empty string, required |
| email | string | Yes | Valid email, must be unique |
| phone | string | No | String, defaults to empty |
| address | string | No | String, defaults to empty |

**Success Response** (201 Created)
```json
{
  "id": "3",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "555-9999",
  "address": "789 Pine Rd"
}
```

**Error Responses**:

**400 Bad Request** - Missing required field
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "'email' is required and must be a string"
  }
}
```

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**409 Conflict** - Duplicate email
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Customer with email 'john@example.com' already exists"
  }
}
```

---

### PATCH /customers/:id
Update an existing customer.

**Method**: `PATCH`

**URL Parameters**:
- `id` (string, required) - The customer ID

**Headers**:
- `Content-Type: application/json` (required)
- `x-api-key: 12345` (required)

**Request Body** (all fields optional):
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "555-1111",
  "address": "999 Elm St"
}
```

**Request Body Schema**:
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | No | Non-empty string if provided |
| email | string | No | Valid email, unique if provided |
| phone | string | No | String if provided |
| address | string | No | String if provided |

**Success Response** (200 OK)
```json
{
  "id": "1",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "555-1111",
  "address": "999 Elm St"
}
```

**Error Responses**:

**400 Bad Request** - Invalid field format
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "'name' must be a non-empty string"
  }
}
```

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**404 Not Found** - Customer doesn't exist
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer 999 not found"
  }
}
```

**409 Conflict** - Duplicate email
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Customer with email 'existing@example.com' already exists"
  }
}
```

---

### DELETE /customers/:id
Delete a customer.

**Method**: `DELETE`

**URL Parameters**:
- `id` (string, required) - The customer ID

**Headers**:
- `x-api-key: 12345` (required)

**Request Body**: None

**Success Response** (204 No Content)
```
(empty body)
```

**Error Responses**:

**401 Unauthorized** - Missing or invalid API key
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**404 Not Found** - Customer doesn't exist
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer 999 not found"
  }
}
```

---

## Status Codes Summary

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET or PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (SKU, email) |

---

## Response Format

All responses follow a consistent JSON format:

**Success (GET, PATCH)**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Success (POST)**
```json
{
  "id": "generated-id",
  "field1": "value1",
  "field2": "value2"
}
```

**Success (DELETE)**
```
(empty body, no JSON)
```

**Error**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation"
  }
}
```

**List with Pagination (Products)**
```json
{
  "data": [
    { "item": 1 },
    { "item": 2 }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```
