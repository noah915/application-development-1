const { pool } = require('../db');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.',
        statusCode: 400
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();
    try {
      // Check if user already exists
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists.',
          statusCode: 400
        });
      }

      // Insert new user (default role is 'user' unless admin)
      const userRole = role === 'admin' ? 'admin' : 'user';
      const [result] = await connection.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, userRole]
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        userId: result.insertId,
        statusCode: 201
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
        statusCode: 400
      });
    }

    const connection = await pool.getConnection();
    try {
      // Find user
      const [users] = await connection.execute(
        'SELECT id, password, role FROM users WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password.',
          statusCode: 401
        });
      }

      const user = users[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password.',
          statusCode: 401
        });
      }

      // Set session
      req.session.userId = user.id;
      req.session.role = user.role;

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        userId: user.id,
        role: user.role,
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed.',
        statusCode: 500
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful.',
      statusCode: 200
    });
  });
};

// Get current user info
exports.getCurrentUser = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [req.session.userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
          statusCode: 404
        });
      }

      res.status(200).json({
        success: true,
        data: users[0],
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};
