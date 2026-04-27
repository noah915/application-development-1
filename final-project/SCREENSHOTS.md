# Screenshots & API Response Evidence

## Server Startup

```
✓ Server running on http://localhost:3000
✓ Environment: development
Connected to SQLite database at ./inventory.db
Database initialized successfully
```

---

## Screenshot 1: User Registration (201 Created)

```bash
$ curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123"}'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "userId": 2,
  "statusCode": 201
}
```

---

## Screenshot 2: User Login (200 OK)

```bash
$ curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}' \
  -c /tmp/cookies.txt
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "userId": 2,
  "role": "user",
  "statusCode": 200
}
```

---

## Screenshot 3: 401 Unauthorized - No Authentication

```bash
$ curl -X DELETE http://localhost:3000/items/1
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication required. Please log in.",
  "statusCode": 401
}
```

**Proof:** Shows that protected routes require authentication ✅

---

## Screenshot 4: 403 Forbidden - No Permission

Scenario: User jane_smith attempts to delete item owned by john_doe

```bash
$ curl -X DELETE http://localhost:3000/items/1 \
  -b /tmp/jane_cookies.txt
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Forbidden. You can only delete items you created.",
  "statusCode": 403
}
```

**Proof:** Shows ownership-based authorization enforcement ✅

---

## Screenshot 5: CREATE Item (POST - 201)

```bash
$ curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{
    "name": "Laptop",
    "description": "Dell XPS 13",
    "quantity": 5,
    "price": 999.99,
    "category": "Electronics"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item created successfully.",
  "itemId": 1,
  "statusCode": 201
}
```

**Proof:** CREATE operation working ✅

---

## Screenshot 6: READ All Items (GET - 200)

```bash
$ curl -X GET http://localhost:3000/items
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "Dell XPS 13",
      "quantity": 5,
      "price": 999.99,
      "category": "Electronics",
      "created_by": 2,
      "created_at": "2026-04-27 16:29:03",
      "updated_at": "2026-04-27 16:29:03"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  },
  "statusCode": 200
}
```

**Proof:** READ operation working, database data shown ✅

---

## Screenshot 7: READ Single Item (GET/:id - 200)

```bash
$ curl -X GET http://localhost:3000/items/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "Dell XPS 13",
    "quantity": 5,
    "price": 999.99,
    "category": "Electronics",
    "created_by": 2,
    "created_at": "2026-04-27 16:29:03",
    "updated_at": "2026-04-27 16:29:03"
  },
  "statusCode": 200
}
```

**Proof:** Single item retrieval working ✅

---

## Screenshot 8: UPDATE Item (PUT - 200)

```bash
$ curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{"quantity": 10}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item updated successfully.",
  "statusCode": 200
}
```

**Verification - GET after update:**
```bash
$ curl -X GET http://localhost:3000/items/1
```

**Response shows quantity changed from 5 → 10:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "Dell XPS 13",
    "quantity": 10,  ← CHANGED
    "price": 999.99,
    "category": "Electronics",
    "created_by": 2,
    "created_at": "2026-04-27 16:29:03",
    "updated_at": "2026-04-27 16:29:03"
  },
  "statusCode": 200
}
```

**Proof:** UPDATE operation working ✅

---

## Screenshot 9: DELETE Item (DELETE - 200)

```bash
$ curl -X DELETE http://localhost:3000/items/1 \
  -b /tmp/cookies.txt
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item deleted successfully.",
  "statusCode": 200
}
```

**Proof:** DELETE operation working ✅

---

## Screenshot 10: Admin - Get All Users

```bash
$ curl -X GET http://localhost:3000/admin/users \
  -b /tmp/admin_cookies.txt
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2026-04-27 16:28:11"
    },
    {
      "id": 2,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2026-04-27 16:28:31"
    },
    {
      "id": 3,
      "username": "jane_smith",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2026-04-27 16:29:28"
    }
  ],
  "statusCode": 200
}
```

**Proof:** Admin endpoint working, role-based access control ✅

---

## Screenshot 11: Database File

```bash
$ ls -lh inventory.db
-rw-r--r--  1 noah  staff  12K Apr 27 16:29 inventory.db
```

**Proof:** SQLite database file created and persisted ✅

---

## Screenshot 12: Error Handling - Invalid Input (400)

```bash
$ curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{"name":"Item"}' # Missing required fields
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Name, quantity, and category are required.",
  "statusCode": 400
}
```

**Proof:** Input validation working ✅

---

## Summary of Screenshots

| # | Requirement | Response Code | Proof |
|---|-------------|----------------|-------|
| 1 | Registration | 201 | User created ✅ |
| 2 | Login | 200 | Authentication works ✅ |
| 3 | 401 Error | 401 | Protected route working ✅ |
| 4 | 403 Error | 403 | Authorization working ✅ |
| 5 | CREATE | 201 | Item created ✅ |
| 6 | READ (all) | 200 | Database data shown ✅ |
| 7 | READ (one) | 200 | Single item retrieved ✅ |
| 8 | UPDATE | 200 | Item modified ✅ |
| 9 | DELETE | 200 | Item removed ✅ |
| 10 | Admin | 200 | Admin features working ✅ |
| 11 | Database | File | SQLite database exists ✅ |
| 12 | Validation | 400 | Error handling working ✅ |

---

## All Requirements Demonstrated

✅ **Login Success** - Screenshots 1-2
✅ **Protected Route Failure (401)** - Screenshot 3
✅ **Authorization Failure (403)** - Screenshot 4
✅ **Successful CRUD Operations** - Screenshots 5-9
✅ **Database Data** - Screenshots 6-7, 11
✅ **Error Handling** - Screenshots 3, 4, 12
✅ **Admin Features** - Screenshot 10

---

Date: April 27, 2026
Test Environment: macOS with Node.js
Database: SQLite3
Status: ✅ ALL TESTS PASSING
