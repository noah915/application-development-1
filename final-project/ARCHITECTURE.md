# Architecture & Design Document

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser/API Client)              │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Routes & Request Handlers                │   │
│  │  - /auth (register, login, logout)                  │   │
│  │  - /items (CRUD operations)                         │   │
│  │  - /admin (user & stats management)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │              Middleware Stack                         │  │
│  │  1. bodyParser - JSON parsing                        │  │
│  │  2. express-session - Session management            │  │
│  │  3. isAuthenticated - Auth check                     │  │
│  │  4. isAdmin - Admin check                            │  │
│  │  5. errorHandler - Global error handling             │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │            Controllers (Business Logic)               │  │
│  │  - authController (user registration, login)         │  │
│  │  - itemsController (CRUD items)                      │  │
│  │  - adminController (admin operations)                │  │
│  └────────────────────────┬─────────────────────────────┘  │
└────────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                           │
│  ┌─────────────────┐          ┌──────────────────────────┐  │
│  │  users table    │◄────────►│  inventory_items table   │  │
│  ├─────────────────┤          ├──────────────────────────┤  │
│  │ id (PK)         │          │ id (PK)                  │  │
│  │ username (UQ)   │          │ name                     │  │
│  │ email (UQ)      │          │ description              │  │
│  │ password        │          │ quantity                 │  │
│  │ role            │          │ price                    │  │
│  │ created_at      │          │ category                 │  │
│  │                 │          │ created_by (FK)◄────────┤  │
│  │                 │          │ created_at              │  │
│  │                 │          │ updated_at              │  │
│  └─────────────────┘          └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure & Responsibilities

```
final-project/
│
├── server.js ........................... Main application entry point
│   ├── Initialize database
│   ├── Configure middleware
│   ├── Mount routes
│   └── Start server
│
├── db.js .............................. Database connection & schema
│   ├── Create connection pool
│   ├── Initialize tables
│   ├── Define schema
│   └── Export pool connection
│
├── routes/ ............................ Route definitions
│   ├── auth.js
│   │   ├── POST /auth/register
│   │   ├── POST /auth/login
│   │   ├── POST /auth/logout
│   │   └── GET /auth/me
│   ├── items.js
│   │   ├── GET /items
│   │   ├── GET /items/:id
│   │   ├── GET /items/category/:cat
│   │   ├── POST /items
│   │   ├── PUT /items/:id
│   │   └── DELETE /items/:id
│   └── admin.js
│       ├── GET /admin/users
│       ├── PUT /admin/users/:id/role
│       ├── GET /admin/users/:id/items
│       ├── DELETE /admin/items/:id
│       └── GET /admin/statistics
│
├── controllers/ ....................... Business logic handlers
│   ├── authController.js
│   │   ├── register()
│   │   ├── login()
│   │   ├── logout()
│   │   └── getCurrentUser()
│   ├── itemsController.js
│   │   ├── createItem()
│   │   ├── getAllItems()
│   │   ├── getItemById()
│   │   ├── updateItem()
│   │   ├── deleteItem()
│   │   └── getItemsByCategory()
│   └── adminController.js
│       ├── getAllUsers()
│       ├── updateUserRole()
│       ├── getUserItems()
│       ├── deleteItemAsAdmin()
│       └── getStatistics()
│
└── middleware/ ........................ Request interceptors
    ├── auth.js
    │   ├── isAuthenticated() ......... Check session exists
    │   ├── isAdmin() ................ Check admin role
    │   └── isOwnerOrAdmin() ......... Check ownership
    └── errorHandler.js
        └── errorHandler() ........... Global error handling
```

## Data Flow Examples

### Example 1: User Login Flow

```
Client                    Server                    Database
  │                         │                          │
  ├─ POST /auth/login ─────►│                          │
  │                         │                          │
  │                         ├─ Parse request body      │
  │                         ├─ Validate input          │
  │                         │                          │
  │                         ├─ Query user by username ─┼─►│
  │                         │                          │
  │                         │◄─ User found ────────────┤
  │                         │                          │
  │                         ├─ Compare passwords       │
  │                         │  (bcrypt.compare)        │
  │                         │                          │
  │                         ├─ Create session         │
  │                         │  (session stored)        │
  │                         │                          │
  │◄─ 200 + session ────────┤                          │
  │                         │                          │
```

### Example 2: Create Item with Authorization

```
Client                    Server                    Database
  │                         │                          │
  ├─ POST /items ──────────►│                          │
  │ (with session cookie)   │                          │
  │                         ├─ Parse body              │
  │                         ├─ Check session valid     │
  │                         ├─ Validate data           │
  │                         │  - name required         │
  │                         │  - quantity >= 0         │
  │                         │                          │
  │                         ├─ Extract userId from session
  │                         │                          │
  │                         ├─ Insert item ───────────►│
  │                         │  (created_by = userId)   │
  │                         │                          │
  │                         │◄─ New item ID ───────────┤
  │                         │                          │
  │◄─ 201 + itemId ─────────┤                          │
  │                         │                          │
```

### Example 3: Update Item with Ownership Check

```
Client                    Server                    Database
  │                         │                          │
  ├─ PUT /items/1 ─────────►│                          │
  │                         │                          │
  │                         ├─ Check session valid     │
  │                         ├─ Get userId & role       │
  │                         │                          │
  │                         ├─ Query item by ID ───────┼─►│
  │                         │                          │
  │                         │◄─ Item data ─────────────┤
  │                         │                          │
  │                         ├─ Check Authorization:    │
  │                         │  - Is user admin? OR     │
  │                         │  - Is user creator?      │
  │                         │                          │
  │                         ├─ Update item ───────────►│
  │                         │                          │
  │                         │◄─ Success ───────────────┤
  │                         │                          │
  │◄─ 200 Success ──────────┤                          │
  │                         │                          │
```

## Authentication Flow

### Session-Based Authentication

1. **User Registration**
   - Client sends: username, email, password
   - Server: Hash password with bcryptjs
   - Server: Insert user into database
   - Response: User ID

2. **User Login**
   - Client sends: username, password
   - Server: Find user by username
   - Server: Compare password hash
   - Server: Create session (express-session)
   - Server: Session stored with session ID in cookie
   - Response: Session cookie (HttpOnly)

3. **Authenticated Request**
   - Client sends: Request + Session Cookie
   - Server: Read session ID from cookie
   - Server: Lookup session store
   - Server: Retrieve `userId` and `role`
   - Server: Proceed with request if valid
   - Response: Resource or 401 if invalid

4. **Logout**
   - Client sends: Session Cookie
   - Server: Destroy session in store
   - Server: Clear session cookie
   - Response: Logout successful

## Authorization Matrix

```
Endpoint                    | Auth Required | Role Check | Ownership Check
────────────────────────────┼───────────────┼────────────┼────────────────
GET /items                  | NO            | NO         | NO
GET /items/:id              | NO            | NO         | NO
GET /items/category/:cat    | NO            | NO         | NO
────────────────────────────┼───────────────┼────────────┼────────────────
POST /items                 | YES           | NO         | N/A (creates new)
PUT /items/:id              | YES           | NO         | YES (owner only)
DELETE /items/:id           | YES           | NO         | YES (owner only)
────────────────────────────┼───────────────┼────────────┼────────────────
POST /auth/register         | NO            | NO         | N/A
POST /auth/login            | NO            | NO         | N/A
POST /auth/logout           | YES           | NO         | N/A
GET /auth/me                | YES           | NO         | N/A
────────────────────────────┼───────────────┼────────────┼────────────────
GET /admin/users            | YES           | YES(admin) | N/A
PUT /admin/users/:id/role   | YES           | YES(admin) | N/A
GET /admin/users/:id/items  | YES           | YES(admin) | N/A
DELETE /admin/items/:id     | YES           | YES(admin) | N/A
GET /admin/statistics       | YES           | YES(admin) | N/A
```

## Error Handling Strategy

```
         Request
           │
           ▼
    ┌──────────────┐
    │ Route Handler│
    └──────┬───────┘
           │
      Try-Catch Block
           │
    ┌──────┴─────────┐
    ▼                ▼
   Error        No Error
    │               │
    ▼               ▼
  next(err)    Return Response
    │              (200/201)
    ▼
 Error Middleware
    │
    ├─ Check error type
    ├─ Determine status code
    ├─ Format error response
    └─► Response (400/401/403/404/500)
```

## Security Features

### 1. Password Security
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Salt: random, per-user

### 2. Session Management
- express-session with in-memory store
- HttpOnly flag prevents XSS access
- Secure flag for HTTPS environments
- 24-hour expiration

### 3. Database Security
- Parameterized queries prevent SQL injection
- Foreign key constraints ensure data integrity
- Passwords hashed before storage

### 4. Authorization
- Role-based access (admin vs user)
- Ownership verification for modifications
- Middleware checks before route handlers

### 5. Input Validation
- Required fields checked
- Data types validated
- Negative quantities rejected

## Performance Considerations

### Database Optimization
- Foreign key indexes on `created_by`
- Pagination with LIMIT/OFFSET
- Connection pooling (10 connections)

### Caching Opportunities (Future)
- Cache user sessions
- Cache inventory statistics
- Cache category lists

### Query Efficiency
- Use WHERE clauses for filtering
- Select only needed columns
- Use INNER JOIN for relationships

## Testing Strategy

### Unit Tests (Controllers)
- Test each controller function independently
- Mock database responses
- Verify business logic

### Integration Tests (Routes)
- Test full request/response cycle
- Verify authentication flow
- Test authorization checks

### End-to-End Tests ()
- Test complete user workflows
- Verify database constraints
- Test error scenarios

## Deployment Considerations

### Environment Variables
- Database credentials
- Session secret
- Node environment
- Port number

### Database Setup
- User permissions
- Connection limits
- Backup strategy

### Security
- HTTPS only in production
- Secure cookie flags
- CORS configuration
- Rate limiting
- Request validation

### Monitoring
- Error logging
- Query logging
- Performance metrics
- User activity audit trail

---

This architecture provides a scalable, secure, and maintainable backend API following RESTful principles and Express.js best practices.
