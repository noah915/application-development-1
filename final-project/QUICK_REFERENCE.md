# Quick Reference Guide

## Starting the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Key Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout (protected)
- `GET /auth/me` - Get current user info (protected)

### Inventory Items
- `GET /items` - Get all items (paginated)
- `GET /items/:id` - Get single item
- `GET /items/category/:category` - Get items by category
- `POST /items` - Create item (protected)
- `PUT /items/:id` - Update item (protected, owner/admin)
- `DELETE /items/:id` - Delete item (protected, owner/admin)

### Admin Routes (Admin Only)
- `GET /admin/users` - Get all users
- `PUT /admin/users/:userId/role` - Update user role
- `GET /admin/users/:userId/items` - Get user's items
- `DELETE /admin/items/:itemId` - Delete any item
- `GET /admin/statistics` - Get inventory statistics

## Common Curl Commands

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@example.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"user1","password":"pass123"}'
```

### Get All Items
```bash
curl http://localhost:3000/items
```

### Create Item (with session)
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Product","quantity":10,"price":99.99,"category":"Category"}'
```

### Update Item
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"quantity":5}'
```

### Delete Item
```bash
curl -X DELETE http://localhost:3000/items/1 \
  -b cookies.txt
```

## Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| DB_HOST | localhost | MySQL host |
| DB_PORT | 3306 | MySQL port |
| DB_USER | root | MySQL user |
| DB_PASSWORD | password | MySQL password |
| DB_NAME | inventory_system | Database name |
| SESSION_SECRET | secret_key_123 | Session encryption key |
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment |

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Authorization Rules

| Action | Regular User | Admin |
|--------|------|-------|
| View Items | ✓ | ✓ |
| Create Item | ✓ | ✓ |
| Update Own Item | ✓ | ✓ |
| Update Any Item | ✗ | ✓ |
| Delete Own Item | ✓ | ✓ |
| Delete Any Item | ✗ | ✓ |
| Manage Users | ✗ | ✓ |
| View Stats | ✗ | ✓ |

## Troubleshooting

### Connection Refused
- Ensure MySQL is running
- Check DB credentials in .env

### Session Not Working
- Clear browser cookies
- Verify NODE_ENV is not 'production' for secure cookies
- Check SESSION_SECRET is set

### 403 Forbidden on Your Own Item
- Verify you're the item creator
- Check user ID matches created_by

### 404 Not Found
- Verify item ID exists
- Check table has data

## Database Queries

### Show all users
```sql
SELECT * FROM users;
```

### Show all items
```sql
SELECT * FROM inventory_items;
```

### Show items by category
```sql
SELECT * FROM inventory_items WHERE category = 'Electronics';
```

### Show user statistics
```sql
SELECT u.username, COUNT(i.id) as item_count 
FROM users u 
LEFT JOIN inventory_items i ON u.id = i.created_by 
GROUP BY u.id;
```

## File Structure

```
final-project/
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth, error handling
├── db.js            # Database config
├── server.js        # Express app
├── package.json     # Dependencies
├── .env.example     # Config template
├── .gitignore       # Git ignore rules
├── README.md        # Full documentation
├── TESTING.md       # Test scenarios
├── EXAMPLES.md      # Response examples
└── sample-data.sql  # Test data
```

## Development Tips

1. Use `npm run dev` for development with auto-reload
2. Test with Postman or similar tool
3. Save cookies between requests for session testing
4. Use admin account to test authorization features
5. Check console for detailed error messages
6. Enable MySQL logging for debugging queries

## Next Steps for Production

- [ ] Use JWT instead of sessions
- [ ] Add rate limiting
- [ ] Implement CORS properly
- [ ] Add request validation
- [ ] Set up proper logging
- [ ] Add unit tests
- [ ] Configure HTTPS
- [ ] Set secure cookie flags
- [ ] Implement refresh tokens
- [ ] Add request timeouts

---

For complete documentation, see README.md
