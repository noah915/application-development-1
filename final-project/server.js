const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const fs = require('fs');
const path = require('path');
const { initializeDatabase } = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
const SESSION_DB_PATH = process.env.SESSION_DB_PATH || path.join(__dirname, 'sessions.sqlite');
const sessionDbDir = path.dirname(SESSION_DB_PATH) || __dirname;
if (sessionDbDir && sessionDbDir !== '.' && !fs.existsSync(sessionDbDir)) {
  fs.mkdirSync(sessionDbDir, { recursive: true });
}

app.use(session({
  store: new SQLiteStore({
    db: path.basename(SESSION_DB_PATH),
    dir: sessionDbDir,
    table: 'sessions',
    concurrentDB: true
  }),
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/items', itemsRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    statusCode: 200
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found.',
    statusCode: 404
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database ready');

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
