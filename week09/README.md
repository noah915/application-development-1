# Task Management API

A professional RESTful API for managing tasks, products, and customers with comprehensive middleware for authentication, validation, and request timing.

## Project Overview

### What the API Does

This is a full-featured REST API that provides endpoints for managing three core resources:
- **Tasks**: Create, read, update, and delete task items with title, description, and completion status
- **Products**: Manage product inventory with pricing, SKUs, and descriptions
- **Customers**: Maintain customer records with contact information

The API includes production-grade middleware for request timing, validation, and API key authentication.

### Target Users

- Frontend developers building task management applications
- Mobile app developers needing a backend API
- E-commerce platforms requiring product and customer management
- Internal tools and dashboards requiring backend services

### Core Resources

1. **Tasks** (`/tasks`) - Simple task management with completion tracking
2. **Products** (`/products`) - Product inventory with SKU management and pagination
3. **Customers** (`/customers`) - Customer relationship management with contact details

---

## Setup Instructions

### Prerequisites

- **Node.js**: v18.0.0 or higher (compatible with Node 16+)
- **npm**: Included with Node.js

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd week09
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

   Server will start on `http://localhost:3000`

### Available Scripts

- **Start server**: `npm start`
- **Development mode**: `npm run dev`
- **Lint code**: `npm run lint`

### Environment Variables

The API works without environment variables for local development. The following can be customized:

- `PORT` (default: 3000) - The port the server listens on

Example:
```bash
PORT=4000 npm start
```

---

## API Overview

All endpoints return JSON responses. The API uses standard HTTP status codes.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **TASKS** |
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Get a specific task by ID |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |
| **PRODUCTS** |
| GET | `/products` | List products with pagination |
| GET | `/products/:id` | Get a specific product |
| POST | `/products` | Create a new product |
| PATCH | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |
| **CUSTOMERS** |
| GET | `/customers` | List all customers |
| GET | `/customers/:id` | Get a specific customer |
| POST | `/customers` | Create a new customer |
| PATCH | `/customers/:id` | Update a customer |
| DELETE | `/customers/:id` | Delete a customer |

### Authentication & Validation

- **All POST, PATCH, DELETE requests** require the `x-api-key: 12345` header
- **All requests** are validated for correct input format
- **Response time** is logged for every request in format: `[METHOD /path] completed in Xms`

---

## Example Requests

### 1. Successful POST - Create a Task

**Request**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: 12345" \
  -d '{
    "title": "Complete assignment",
    "description": "Finish the middleware assignment",
    "completed": false
  }'
```

**Response** (201 Created)
```json
{
  "id": "1",
  "title": "Complete assignment",
  "description": "Finish the middleware assignment",
  "completed": false
}
```

**Console Output**
```
[2025-03-06T10:30:45.123Z] POST /tasks
[POST /tasks] completed in 5ms
```

---

### 2. Validation Error - Missing Required Field

**Request**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: 12345" \
  -d '{
    "description": "Task with no title"
  }'
```

**Response** (400 Bad Request)
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "'title' is required and must be a non-empty string"
  }
}
```

**Console Output**
```
[2025-03-06T10:30:46.200Z] POST /tasks
[POST /tasks] completed in 2ms
```

---

### 3. API Key Missing - Unauthorized

**Request**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete assignment"
  }'
```

**Response** (401 Unauthorized)
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing x-api-key header"
  }
}
```

**Console Output**
```
[2025-03-06T10:30:47.100Z] POST /tasks
[POST /tasks] completed in 1ms
```

---

### 4. GET Request (No API Key Required)

**Request**
```bash
curl http://localhost:3000/tasks
```

**Response** (200 OK)
```json
[
  {
    "id": "1",
    "title": "Complete assignment",
    "description": "Finish the middleware assignment",
    "completed": false
  }
]
```

---

### 5. Successful POST - Create a Product

**Request**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: 12345" \
  -d '{
    "name": "Wireless Mouse",
    "price": 29.99,
    "sku": "WMOUSE-001",
    "description": "Ergonomic wireless mouse"
  }'
```

**Response** (201 Created)
```json
{
  "id": "1",
  "name": "Wireless Mouse",
  "price": 29.99,
  "sku": "WMOUSE-001",
  "description": "Ergonomic wireless mouse"
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Status Codes

- **200 OK** - Successful GET request
- **201 Created** - Resource successfully created
- **204 No Content** - Successful DELETE request
- **400 Bad Request** - Validation error or invalid input
- **401 Unauthorized** - Missing or invalid API key
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Resource already exists (duplicate SKU/email)

---

## Middleware Pipeline

Requests pass through the following middleware in order:

1. **express.json()** - Parse JSON request bodies
2. **logger** - Log request with timestamp
3. **timing** - Measure and log request processing time
4. **apiKeyAuth** - Validate API key for write operations
5. **Route handlers** - Process the request
6. **Resource validation** (route-specific) - Validate request data

---

## Project Structure

```
week09/
├── server.js                          # Express application setup
├── package.json                       # Dependencies and scripts
├── middleware/
│   ├── logger.js                      # Request logging
│   ├── timing.js                      # Response timing
│   ├── apiKeyAuth.js                  # API key authentication
│   └── validateTask.js                # Task validation
├── routes/
│   ├── tasks.js                       # Task routes
│   ├── products.js                    # Product routes
│   └── customers.js                   # Customer routes
├── controllers/
│   ├── tasksController.js             # Task business logic
│   ├── productsController.js          # Product business logic
│   └── customersController.js         # Customer business logic
├── README.md                          # This file
├── API.md                             # Detailed API documentation
└── refactor.md                        # Code improvements documentation
```

---

## Code Quality

This project maintains professional code standards:

- **ESLint** is configured and all code passes linting
- **Consistent error handling** across all endpoints
- **Reusable middleware** for authentication and validation
- **Proper separation of concerns** (routes, controllers, middleware)
- **Defensive validation** in both middleware and controllers

Run the linter:
```bash
npm run lint
```

---

## Additional Documentation

- [API.md](API.md) - Detailed endpoint documentation with request/response schemas
- [refactor.md](refactor.md) - Code improvements and refactoring details
- [code-review.md](code-review.md) - Code review reflection and analysis
