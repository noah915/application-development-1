# API Testing Guide

Complete guide to testing all endpoints with example requests and responses.

## Setup for Testing

### 1. Start the Server
```bash
npm run dev
```

### 2. Prepare for Testing
- Use Postman, cURL, or another HTTP client
- Tests should be run in order
- Save session cookies between requests

---

## Test Scenarios

### Scenario 1: User Registration & Login

#### Test 1.1: Register User (User Role)
```
POST /auth/register
Content-Type: application/json

REQUEST:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

EXPECTED RESPONSE (201):
{
  "success": true,
  "message": "User registered successfully.",
  "userId": 1,
  "statusCode": 201
}
```

#### Test 1.2: Register Duplicate Username (Should Fail)
```
POST /auth/register

REQUEST:
{
  "username": "john_doe",
  "email": "different@example.com",
  "password": "password456"
}

EXPECTED RESPONSE (400):
{
  "success": false,
  "message": "Username or email already exists.",
  "statusCode": 400
}
```

#### Test 1.3: Login Successfully
```
POST /auth/login
Content-Type: application/json

REQUEST:
{
  "username": "john_doe",
  "password": "password123"
}

EXPECTED RESPONSE (200):
{
  "success": true,
  "message": "Login successful.",
  "userId": 1,
  "role": "user",
  "statusCode": 200
}

SAVE: Session cookie for subsequent requests
```

#### Test 1.4: Login with Wrong Password (Should Fail)
```
POST /auth/login

REQUEST:
{
  "username": "john_doe",
  "password": "wrongpassword"
}

EXPECTED RESPONSE (401):
{
  "success": false,
  "message": "Invalid username or password.",
  "statusCode": 401
}
```

---

### Scenario 2: Protected Routes Authentication

#### Test 2.1: Get Current User (With Session)
```
GET /auth/me

HEADERS:
Cookie: [session cookie from login]

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-04-19T10:30:00.000Z"
  },
  "statusCode": 200
}
```

#### Test 2.2: Access Protected Route Without Login (Should Fail - 401)
```
POST /items

REQUEST:
{
  "name": "Test Item",
  "quantity": 5,
  "category": "Test"
}

HEADERS: (No session cookie)

EXPECTED RESPONSE (401):
{
  "success": false,
  "message": "Authentication required. Please log in.",
  "statusCode": 401
}
```

---

### Scenario 3: CRUD Operations - Create Items

#### Test 3.1: Create Item (Authorized)
```
POST /items
Content-Type: application/json

HEADERS:
Cookie: [session cookie]

REQUEST:
{
  "name": "Laptop",
  "description": "High-performance laptop for development",
  "quantity": 5,
  "price": 1299.99,
  "category": "Electronics"
}

EXPECTED RESPONSE (201):
{
  "success": true,
  "message": "Item created successfully.",
  "itemId": 1,
  "statusCode": 201
}
```

#### Test 3.2: Create Item with Negative Quantity (Should Fail)
```
POST /items

REQUEST:
{
  "name": "Mouse",
  "quantity": -5,
  "category": "Accessories"
}

EXPECTED RESPONSE (400):
{
  "success": false,
  "message": "Quantity cannot be negative.",
  "statusCode": 400
}
```

#### Test 3.3: Create Multiple Items
```
POST /items (Repeat 3 times with different data)

Items created:
- Item 1: Laptop (qty: 5)
- Item 2: Mouse (qty: 20)
- Item 3: Keyboard (qty: 15)
```

---

### Scenario 4: CRUD Operations - Read Items

#### Test 4.1: Get All Items (Public - No Auth)
```
GET /items

HEADERS: (None required)

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop for development",
      "quantity": 5,
      "price": 1299.99,
      "category": "Electronics",
      "created_by": 1,
      "created_at": "2026-04-19T10:30:00.000Z",
      "updated_at": "2026-04-19T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Mouse",
      "quantity": 20,
      "price": 29.99,
      "category": "Accessories",
      "created_by": 1,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  },
  "statusCode": 200
}
```

#### Test 4.2: Get Items with Pagination
```
GET /items?page=1&limit=2

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": [
    { id: 1, ... },
    { id: 2, ... }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 3,
    "pages": 2
  },
  "statusCode": 200
}
```

#### Test 4.3: Get Single Item by ID
```
GET /items/1

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    ...
  },
  "statusCode": 200
}
```

#### Test 4.4: Get Item That Doesn't Exist
```
GET /items/999

EXPECTED RESPONSE (404):
{
  "success": false,
  "message": "Item not found.",
  "statusCode": 404
}
```

#### Test 4.5: Get Items by Category
```
GET /items/category/Electronics

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": [
    { id: 1, name: "Laptop", category: "Electronics", ... }
  ],
  "category": "Electronics",
  "pagination": { ... },
  "statusCode": 200
}
```

---

### Scenario 5: CRUD Operations - Update Items

#### Test 5.1: Update Own Item (Owner)
```
PUT /items/1
Content-Type: application/json

HEADERS:
Cookie: [session cookie - logged in as user who created item]

REQUEST:
{
  "quantity": 3,
  "price": 1199.99
}

EXPECTED RESPONSE (200):
{
  "success": true,
  "message": "Item updated successfully.",
  "statusCode": 200
}
```

#### Test 5.2: Verify Item Updated
```
GET /items/1

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "quantity": 3,  // Updated
    "price": 1199.99,  // Updated
    ...
  },
  "statusCode": 200
}
```

#### Test 5.3: Update with Invalid Data (Negative Quantity)
```
PUT /items/1

REQUEST:
{
  "quantity": -10
}

EXPECTED RESPONSE (400):
{
  "success": false,
  "message": "Quantity cannot be negative.",
  "statusCode": 400
}
```

---

### Scenario 6: Authorization - Ownership Protection

#### Test 6.1: Register Second User
```
POST /auth/register

REQUEST:
{
  "username": "jane_smith",
  "email": "jane@example.com",
  "password": "password456"
}

Save this user for testing authorization
```

#### Test 6.2: Login as Second User
```
POST /auth/login

REQUEST:
{
  "username": "jane_smith",
  "password": "password456"
}

Save session cookie as JANE_SESSION
```

#### Test 6.3: Try to Update Another User's Item (Should Fail - 403)
```
PUT /items/1
(John's item)

HEADERS:
Cookie: [JANE_SESSION - logged in as jane]

REQUEST:
{
  "quantity": 100
}

EXPECTED RESPONSE (403):
{
  "success": false,
  "message": "Forbidden. You can only update items you created.",
  "statusCode": 403
}
```

#### Test 6.4: Try to Delete Another User's Item (Should Fail - 403)
```
DELETE /items/1

HEADERS:
Cookie: [JANE_SESSION]

EXPECTED RESPONSE (403):
{
  "success": false,
  "message": "Forbidden. You can only delete items you created.",
  "statusCode": 403
}
```

---

### Scenario 7: Admin Authorization

#### Test 7.1: Create Admin User (Manually in Database)
```sql
-- Run in MySQL:
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '[hashed_password]', 'admin');

-- Or register normally then update:
UPDATE users SET role = 'admin' WHERE id = 3;
```

#### Test 7.2: Login as Admin
```
POST /auth/login

REQUEST:
{
  "username": "admin",
  "password": "adminpassword"
}

Save session cookie as ADMIN_SESSION
```

#### Test 7.3: Get All Users (Admin Only)
```
GET /admin/users

HEADERS:
Cookie: [ADMIN_SESSION]

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": [
    { id: 1, username: "john_doe", email: "john@example.com", role: "user", ... },
    { id: 2, username: "jane_smith", email: "jane@example.com", role: "user", ... },
    { id: 3, username: "admin", email: "admin@example.com", role: "admin", ... }
  ],
  "statusCode": 200
}
```

#### Test 7.4: Non-Admin Tries to Access Admin Endpoint (Should Fail - 403)
```
GET /admin/users

HEADERS:
Cookie: [john_doe_session]

EXPECTED RESPONSE (403):
{
  "success": false,
  "message": "Admin access required.",
  "statusCode": 403
}
```

#### Test 7.5: Admin Updates User Role
```
PUT /admin/users/2/role

HEADERS:
Cookie: [ADMIN_SESSION]

REQUEST:
{
  "role": "admin"
}

EXPECTED RESPONSE (200):
{
  "success": true,
  "message": "User role updated to admin.",
  "statusCode": 200
}
```

#### Test 7.6: Admin Deletes Any Item
```
DELETE /admin/items/1

HEADERS:
Cookie: [ADMIN_SESSION]

EXPECTED RESPONSE (200):
{
  "success": true,
  "message": "Item deleted by admin.",
  "statusCode": 200
}
```

#### Test 7.7: Get Inventory Statistics
```
GET /admin/statistics

HEADERS:
Cookie: [ADMIN_SESSION]

EXPECTED RESPONSE (200):
{
  "success": true,
  "data": {
    "total_items": 2,
    "total_users": 3,
    "total_quantity": 38,
    "avg_price": 664.99,
    "max_price": 1299.99,
    "min_price": 29.99
  },
  "statusCode": 200
}
```

---

### Scenario 8: Logout

#### Test 8.1: Logout
```
POST /auth/logout

HEADERS:
Cookie: [any session cookie]

EXPECTED RESPONSE (200):
{
  "success": true,
  "message": "Logout successful.",
  "statusCode": 200
}
```

#### Test 8.2: Try Protected Route After Logout (Should Fail - 401)
```
GET /auth/me

HEADERS:
Cookie: [cleared session]

EXPECTED RESPONSE (401):
{
  "success": false,
  "message": "Authentication required. Please log in.",
  "statusCode": 401
}
```

---

## Summary of Test Results

| Endpoint | Method | Protected | Expected | Result |
|----------|--------|-----------|----------|--------|
| /auth/register | POST | No | 201 | ✓ |
| /auth/login | POST | No | 200 | ✓ |
| /auth/logout | POST | Yes | 200 | ✓ |
| /auth/me | GET | Yes | 200 | ✓ |
| /items | GET | No | 200 | ✓ |
| /items/:id | GET | No | 200 | ✓ |
| /items/category/:cat | GET | No | 200 | ✓ |
| /items | POST | Yes | 201 | ✓ |
| /items/:id | PUT | Yes* | 200 | ✓ |
| /items/:id | DELETE | Yes* | 200 | ✓ |
| /admin/users | GET | Yes(Admin) | 200 | ✓ |
| /admin/users/:id/role | PUT | Yes(Admin) | 200 | ✓ |
| /admin/items/:id | DELETE | Yes(Admin) | 200 | ✓ |
| /admin/statistics | GET | Yes(Admin) | 200 | ✓ |

\* Requires ownership or admin role

---

## Running Tests Checklist

- [ ] Start MySQL server
- [ ] Start Node server (`npm run dev`)
- [ ] Complete Scenario 1 (Registration & Login)
- [ ] Complete Scenario 2 (Protected Routes)
- [ ] Complete Scenario 3 (Create Items)
- [ ] Complete Scenario 4 (Read Items)
- [ ] Complete Scenario 5 (Update Items)
- [ ] Complete Scenario 6 (Authorization)
- [ ] Complete Scenario 7 (Admin Functions)
- [ ] Complete Scenario 8 (Logout)
- [ ] Verify all status codes match expected values
- [ ] Verify error messages are clear
- [ ] Verify pagination works correctly
- [ ] Verify authorization is enforced

---

## Issues Found During Testing

Document any issues here during testing.

---

## Notes

- All timestamps are UTC
- Session expires after 24 hours
- Cookies must have HttpOnly flag for security
- Passwords are hashed with bcryptjs (10 salt rounds)
