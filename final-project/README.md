# Inventory System Backend API

A complete backend API for inventory management with role-based authentication, authorization, and full CRUD functionality. Built with Node.js, Express, and SQLite.

## Features

✓ **Authentication** - Session-based login/logout and registration  
✓ **Authorization** - Role-based access control (Admin, User)  
✓ **CRUD Operations** - Full Create/Read/Update/Delete for inventory items  
✓ **Database Integration** - SQLite with proper schema, foreign keys, and three related tables  
✓ **Error Handling** - Consistent JSON error responses with appropriate status codes  
✓ **Pagination** - List endpoints support pagination  
✓ **Admin Features** - User management, admin statistics, inventory oversight  
✓ **Ownership-Based Access** - Users can only modify their own items (creators can only delete/update their items unless admin)  
✓ **Persistent Sessions** - Session data stored in SQLite with connect-sqlite3  
✓ **Inventory Movements** - Item movement logging for quantity changes

## Project Structure

```
final-project/
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── items.js         # Inventory items routes
│   └── admin.js         # Admin-only routes
├── controllers/
│   ├── authController.js      # Auth logic
│   ├── itemsController.js     # Items CRUD logic
│   └── adminController.js     # Admin logic
├── middleware/
│   ├── auth.js          # Authentication & authorization checks
│   └── errorHandler.js  # Global error handling
├── db.js                # Database connection & initialization
├── server.js            # Express app setup
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd final-project
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_PATH=./inventory.db
SESSION_DB_PATH=./sessions.sqlite
SESSION_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Inventory Items Table
```sql
CREATE TABLE inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  price REAL,
  category TEXT,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
)
```

### Item Movements Table
```sql
CREATE TABLE item_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  change_quantity INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully.",
  "userId": 1,
  "statusCode": 201
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful.",
  "userId": 1,
  "role": "user",
  "statusCode": 200
}
```

#### Logout (Protected)
```
POST /auth/logout
Response (200):
{
  "success": true,
  "message": "Logout successful.",
  "statusCode": 200
}
```

#### Get Current User (Protected)
```
GET /auth/me
Response (200):
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

### Inventory Items Endpoints

#### Get All Items (Public)
```
GET /items?page=1&limit=10
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop",
      "quantity": 5,
      "price": 999.99,
      "category": "Electronics",
      "created_by": 1,
      "created_at": "2026-04-19T10:30:00.000Z",
      "updated_at": "2026-04-19T10:30:00.000Z"
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

#### Log Item Movement (Protected)
```
POST /items/:id/movements
Content-Type: application/json
{
  "change_quantity": -2,
  "note": "Sold two units"
}

Response (201):
{
  "success": true,
  "message": "Item movement recorded successfully.",
  "movementId": 4,
  "itemId": 1,
  "statusCode": 201
}
```

#### Get Item Movements (Protected)
```
GET /items/:id/movements
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 4,
      "item_id": 1,
      "user_id": 1,
      "recorded_by": "john_doe",
      "change_quantity": -2,
      "note": "Sold two units",
      "created_at": "2026-04-20T14:20:00.000Z"
    }
  ],
  "statusCode": 200
}
```

#### Get Item by ID (Public)
```
GET /items/:id
Response (200):
{
  "success": true,
  "data": { ... },
  "statusCode": 200
}
```

#### Get Items by Category (Public)
```
GET /items/category/:category?page=1&limit=10
Response (200):
{
  "success": true,
  "data": [ ... ],
  "category": "Electronics",
  "pagination": { ... },
  "statusCode": 200
}
```

#### Create Item (Protected)
```
POST /items
Content-Type: application/json

{
  "name": "Mouse",
  "description": "Wireless mouse",
  "quantity": 20,
  "price": 29.99,
  "category": "Accessories"
}

Response (201):
{
  "success": true,
  "message": "Item created successfully.",
  "itemId": 2,
  "statusCode": 201
}
```

#### Update Item (Protected - Owner or Admin)
```
PUT /items/:id
Content-Type: application/json

{
  "quantity": 15,
  "price": 24.99
}

Response (200):
{
  "success": true,
  "message": "Item updated successfully.",
  "statusCode": 200
}
```

#### Delete Item (Protected - Owner or Admin)
```
DELETE /items/:id
Response (200):
{
  "success": true,
  "message": "Item deleted successfully.",
  "statusCode": 200
}
```

### Admin Endpoints (Admin Only)

#### Get All Users
```
GET /admin/users
Response (200):
{
  "success": true,
  "data": [ ... ],
  "statusCode": 200
}
```

#### Update User Role
```
PUT /admin/users/:userId/role
Content-Type: application/json

{
  "role": "admin"
}

Response (200):
{
  "success": true,
  "message": "User role updated to admin.",
  "statusCode": 200
}
```

#### Get User's Items
```
GET /admin/users/:userId/items
Response (200):
{
  "success": true,
  "data": [ ... ],
  "totalItems": 5,
  "statusCode": 200
}
```

#### Delete Item (Admin)
```
DELETE /admin/items/:itemId
Response (200):
{
  "success": true,
  "message": "Item deleted by admin.",
  "statusCode": 200
}
```

#### Get Inventory Statistics
```
GET /admin/statistics
Response (200):
{
  "success": true,
  "data": {
    "total_items": 50,
    "total_users": 10,
    "total_quantity": 500,
    "avg_price": 150.50,
    "max_price": 999.99,
    "min_price": 5.00
  },
  "statusCode": 200
}
```

## HTTP Status Codes

- **200** - Successful request
- **201** - Resource created
- **400** - Bad request (validation error)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (authorization failed)
- **404** - Resource not found
- **500** - Internal server error

## Error Response Format

All errors follow this JSON format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Testing the API

### Using cURL

#### Register a user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### Create an item (after login)
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Product Name",
    "description": "Product description",
    "quantity": 10,
    "price": 99.99,
    "category": "Category"
  }'
```

### Using Postman

1. Create a new collection
2. Add requests for each endpoint
3. Set `Content-Type: application/json` header
4. Use cookies to maintain session across requests
5. Include session cookie in protected routes

## Authorization Rules

### Role-Based Access (Admin vs User)

| Action | User | Admin |
|--------|------|-------|
| View Items | ✓ | ✓ |
| Create Item | ✓ | ✓ |
| Update Own Item | ✓ | ✓ |
| Update Any Item | ✗ | ✓ |
| Delete Own Item | ✓ | ✓ |
| Delete Any Item | ✗ | ✓ |
| View Users | ✗ | ✓ |
| Change User Role | ✗ | ✓ |
| View Statistics | ✗ | ✓ |

### Ownership-Based Access

- **Create**: Must be authenticated
- **Read**: Public (no auth required)
- **Update**: Creator or Admin only
- **Delete**: Creator or Admin only

## Key Features

### 1. Session-Based Authentication
- Passwords hashed with bcryptjs
- Sessions stored with express-session
- Session timeout: 24 hours
- HttpOnly cookies for security

### 2. Role-Based Authorization
- **User**: Can create, read, and manage their own items
- **Admin**: Full access to all resources and management functions

### 3. Database Relationships
- Foreign key constraint: `inventory_items.created_by` → `users.id`
- Cascading delete: Deleting a user removes their items
- Proper indexing for performance

### 4. Error Handling
- Consistent JSON error format
- Appropriate HTTP status codes
- Detailed error messages for debugging
- Global error handling middleware

### 5. Pagination
- Offset-based pagination
- Default limit: 10 items per page
- Query parameters: `page` and `limit`

## Security Considerations

✓ Passwords hashed with bcryptjs (salt rounds: 10)  
✓ Session-based auth with HttpOnly cookies  
✓ CORS ready setup  
✓ Environment variables for sensitive data  
✓ Input validation on all endpoints  
✓ Authorization checks on protected routes  
✓ SQL injection prevention with parameterized queries  

## Future Enhancements

- JWT token-based authentication
- Email verification for registration
- Password reset functionality
- Rate limiting
- Audit logging
- Two-factor authentication
- Image upload support
- Advanced search and filtering
- Inventory history/audit trail

## Troubleshooting

### Database Connection Error
- Ensure the SQLite database path is valid in `.env`
- Confirm `DB_PATH` points to an accessible file location
- Delete `inventory.db` to recreate schema when needed

### Session Not Persisting
- Check cookie settings in `server.js`
- Ensure `express-session` is configured correctly with SQLite store
- Browser must allow cookies

### Authorization Errors (403)
- Verify user role with `GET /auth/me`
- Check item ownership
- Only item creator or admin can modify items

## Support

For issues or questions, refer to:
- [Express Documentation](https://expressjs.com)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

**Course Project - Application Development**  
Built with Node.js, Express, and SQLite
