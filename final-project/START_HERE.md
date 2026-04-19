# START HERE 🚀

Welcome to the Inventory Management System Backend API!

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```
Edit `.env` and add your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_system
SESSION_SECRET=your_secret_key
```

### Step 3: Create MySQL Database
```bash
mysql -u root -p
CREATE DATABASE inventory_system;
EXIT
```

### Step 4: Start Server
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000
Database initialized successfully
```

### Step 5: Test It!
```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"testuser","password":"pass123"}'

# Create an item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Laptop","quantity":5,"price":999.99,"category":"Electronics"}'

# Get all items
curl http://localhost:3000/items
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Full documentation, API reference, setup |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Requirements checklist, completed features |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Common commands & quick lookup |
| [TESTING.md](TESTING.md) | Test scenarios & examples |
| [EXAMPLES.md](EXAMPLES.md) | API response examples |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design & data flows |

---

## 🔑 Key Endpoints

### Public (No Login Required)
- `GET /items` - See all inventory
- `GET /items/:id` - See item details
- `GET /items/category/:category` - See items by category

### User (Login Required)
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /items` - Add item
- `PUT /items/:id` - Edit your item
- `DELETE /items/:id` - Delete your item
- `POST /auth/logout` - Logout

### Admin Only
- `GET /admin/users` - See all users
- `PUT /admin/users/:userId/role` - Change user role
- `DELETE /admin/items/:itemId` - Delete any item
- `GET /admin/statistics` - See statistics

---

## 🔓 Create Admin User

After starting server:

```bash
# 1. Register a normal user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'

# 2. Manually update in MySQL
mysql -u root -p inventory_system
UPDATE users SET role = 'admin' WHERE username = 'admin';
EXIT
```

Now login as admin with username `admin` and password `admin123` to access admin endpoints.

---

## 📋 Project Structure

```
final-project/
├── server.js              # Start here
├── db.js                  # Database setup
├── routes/                # API endpoints
├── controllers/           # Business logic
├── middleware/            # Auth & errors
├── package.json           # Dependencies
├── .env.example           # Config template
├── README.md              # Full docs
└── TESTING.md             # Test guide
```

---

## ⚡ Common Issues

### "Cannot connect to database"
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database name is correct

### "Session not working"
- Make sure you're saving cookies between requests
- Use `curl -c cookies.txt` to save, `-b cookies.txt` to use

### "401 Unauthorized"
- You must login first
- Your session may have expired (24 hours)

### "403 Forbidden"
- Only owners of items can edit/delete them
- Only admins can access /admin/* endpoints

---

## 🧪 Quick Test Flow

1. **Register** → POST /auth/register
2. **Login** → POST /auth/login (save cookie)
3. **Create Item** → POST /items (with cookie)
4. **View Item** → GET /items/1 (public, no cookie needed)
5. **Update Item** → PUT /items/1 (with cookie)
6. **Delete Item** → DELETE /items/1 (with cookie)
7. **Logout** → POST /auth/logout (with cookie)

---

## 📊 Database Tables

**Users**: username, email, password, role (admin/user)
**Items**: name, quantity, price, category, created_by (user who created it)

---

## 💡 Remember

- Public endpoints can be accessed without login
- Protected endpoints require login (session cookie)
- Admin endpoints require admin role
- You can only edit/delete items you created (unless admin)
- Passwords are securely hashed
- Sessions expire after 24 hours

---

## 🎯 Next Steps

1. Read [README.md](README.md) for complete documentation
2. Follow [TESTING.md](TESTING.md) to test all endpoints
3. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands
4. Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system

---

## 🚀 You're Ready!

Your API is fully built and ready to use. Start making requests!

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

For detailed documentation, see [README.md](README.md)

Happy coding! 🎉
