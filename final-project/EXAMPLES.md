# Screenshot Examples & API Response Documentation

This document shows the expected responses for key scenarios that would appear in screenshots.

## 1. User Registration Success

**Request:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123"}'
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "userId": 1,
  "statusCode": 201
}
```

**Screenshot Description:** Green success message with user ID displayed

---

## 2. Login Success  

**Request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "userId": 1,
  "role": "user",
  "statusCode": 200
}
```

**Screenshot Description:** Green login success confirmation with user ID and role

---

## 3. Protected Route Failure - 401 Unauthorized

**Request (No session cookie):**
```bash
curl -X GET http://localhost:3000/auth/me
```

**Response (401):**
```json
{
  "success": false,
  "message": "Authentication required. Please log in.",
  "statusCode": 401
}
```

**Screenshot Description:** Red error showing 401 status code with authentication required message

---

## 4. Authorization Failure - 403 Forbidden

**Scenario:** User A tries to update Item created by User B

**Request (Logged in as jane_smith, trying to update john_doe's item):**
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -b "session=jane_session_cookie" \
  -d '{"quantity": 100}'
```

**Response (403):**
```json
{
  "success": false,
  "message": "Forbidden. You can only update items you created.",
  "statusCode": 403
}
```

**Screenshot Description:** Red error showing 403 Forbidden with permission denied message

---

## 5. Successful Item Creation (CREATE)

**Request:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -b "session=john_session_cookie" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "quantity": 5,
    "price": 1299.99,
    "category": "Electronics"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item created successfully.",
  "itemId": 1,
  "statusCode": 201
}
```

**Screenshot Description:** Green success with new item ID

---

## 6. Successful Item Retrieval (READ)

**Request:**
```bash
curl -X GET http://localhost:3000/items/1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "quantity": 5,
    "price": 1299.99,
    "category": "Electronics",
    "created_by": 1,
    "created_at": "2026-04-19T10:30:00.000Z",
    "updated_at": "2026-04-19T10:30:00.000Z"
  },
  "statusCode": 200
}
```

**Screenshot Description:** Item details displayed with all fields

---

## 7. Get All Items with Pagination (READ Multiple)

**Request:**
```bash
curl -X GET "http://localhost:3000/items?page=1&limit=10"
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "quantity": 5,
      "price": 1299.99,
      "category": "Electronics",
      "created_by": 1,
      "created_at": "2026-04-19T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Mouse",
      "quantity": 20,
      "price": 29.99,
      "category": "Accessories",
      "created_by": 1,
      "created_at": "2026-04-19T11:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Keyboard",
      "quantity": 15,
      "price": 79.99,
      "category": "Accessories",
      "created_by": 2,
      "created_at": "2026-04-19T11:30:00.000Z"
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

**Screenshot Description:** Table showing all inventory items with pagination info

---

## 8. Successful Item Update (UPDATE)

**Request:**
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -b "session=john_session_cookie" \
  -d '{
    "quantity": 3,
    "price": 1199.99
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item updated successfully.",
  "statusCode": 200
}
```

**Verification (GET after update):**
```bash
curl -X GET http://localhost:3000/items/1
```

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "quantity": 3,
    "price": 1199.99,
    "updated_at": "2026-04-19T12:00:00.000Z"
  },
  "statusCode": 200
}
```

**Screenshot Description:** Green success message, then updated item showing new values

---

## 9. Successful Item Deletion (DELETE)

**Request:**
```bash
curl -X DELETE http://localhost:3000/items/3 \
  -b "session=jane_session_cookie"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully.",
  "statusCode": 200
}
```

**Verification (GET after delete returns 404):**
```bash
curl -X GET http://localhost:3000/items/3
```

```json
{
  "success": false,
  "message": "Item not found.",
  "statusCode": 404
}
```

**Screenshot Description:** Green deletion confirmation, then item no longer found

---

## 10. Database Data - Users Table

```sql
SELECT * FROM users;
```

**Result:**
```
| id | username    | email                | password            | role  | created_at          |
|----|-------------|----------------------|-------------------|-------|----------------------|
|  1 | john_doe    | john@example.com     | $2a$10$...hashed  | user  | 2026-04-19 10:30:00 |
|  2 | jane_smith  | jane@example.com     | $2a$10$...hashed  | user  | 2026-04-19 10:45:00 |
|  3 | admin       | admin@example.com    | $2a$10$...hashed  | admin | 2026-04-19 11:00:00 |
```

**Screenshot Description:** Users table showing all registered users with roles

---

## 11. Database Data - Inventory Items Table

```sql
SELECT * FROM inventory_items;
```

**Result:**
```
| id | name      | description                    | quantity | price  | category     | created_by | created_at          | updated_at          |
|----|-----------|---------------------------------|----------|--------|--------------|------------|----------------------|----------------------|
|  1 | Laptop    | High-performance laptop        | 3        | 1199.99| Electronics | 1          | 2026-04-19 10:30:00 | 2026-04-19 12:00:00 |
|  2 | Mouse     | Wireless mouse                 | 20       | 29.99  | Accessories  | 1          | 2026-04-19 11:00:00 | 2026-04-19 11:00:00 |
|  3 | Monitor   | 27-inch 4K monitor            | 8        | 399.99 | Electronics  | 2          | 2026-04-19 11:30:00 | 2026-04-19 11:30:00 |
```

**Screenshot Description:** Inventory items table showing all products with details

---

## 12. Admin - Get All Users

**Request:**
```bash
curl -X GET http://localhost:3000/admin/users \
  -b "session=admin_session_cookie"
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2026-04-19T10:30:00.000Z"
    },
    {
      "id": 2,
      "username": "jane_smith",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2026-04-19T10:45:00.000Z"
    },
    {
      "id": 3,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2026-04-19T11:00:00.000Z"
    }
  ],
  "statusCode": 200
}
```

**Screenshot Description:** Admin dashboard showing all system users

---

## 13. Admin - Inventory Statistics

**Request:**
```bash
curl -X GET http://localhost:3000/admin/statistics \
  -b "session=admin_session_cookie"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_items": 3,
    "total_users": 3,
    "total_quantity": 31,
    "avg_price": 543.29,
    "max_price": 1199.99,
    "min_price": 29.99
  },
  "statusCode": 200
}
```

**Screenshot Description:** Admin statistics dashboard showing inventory metrics

---

## 14. Items by Category

**Request:**
```bash
curl -X GET "http://localhost:3000/items/category/Electronics"
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "quantity": 3,
      "price": 1199.99,
      "category": "Electronics",
      "created_by": 1
    },
    {
      "id": 3,
      "name": "Monitor",
      "quantity": 8,
      "price": 399.99,
      "category": "Electronics",
      "created_by": 2
    }
  ],
  "category": "Electronics",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "statusCode": 200
}
```

**Screenshot Description:** Filtered list of items by category

---

## 15. Error - Invalid Input

**Request:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -b "session=john_session_cookie" \
  -d '{"quantity": -5, "category": "Test"}'
```

**Response (400):**
```json
{
  "success": false,
  "message": "Quantity cannot be negative.",
  "statusCode": 400
}
```

**Screenshot Description:** Red error message showing validation error

---

## Summary of Screenshots Showing All Requirements

✓ **Login Success** - Test #2 (green 200 response)  
✓ **Protected Route Failure (401)** - Test #3 (red 401 unauthorized)  
✓ **Authorization Failure (403)** - Test #4 (red 403 forbidden)  
✓ **Successful CRUD Operations** - Tests #5-9 (create, read, update, delete)  
✓ **Database Data** - Tests #10-11 (users and items tables)  
✓ **Admin Functions** - Tests #12-13 (users list, statistics)  
✓ **Proper Status Codes** - All tests (200, 201, 400, 401, 403, 404)  

All 15 scenarios above can be implemented as visual screenshots by:
1. Running requests in Postman/cURL with response visible
2. Screenshot the response JSON in the tool's UI
3. Include the HTTP status code in screenshot

---

**Note:** Actual timestamps and IDs will vary based on when tests are run. These are example values.
