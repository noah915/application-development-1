const { pool } = require('../db');

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
      );

      res.status(200).json({
        success: true,
        data: users,
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role (admin or user) is required.',
        statusCode: 400
      });
    }

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
          statusCode: 404
        });
      }

      await connection.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, userId]
      );

      res.status(200).json({
        success: true,
        message: `User role updated to ${role}.`,
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Get all items created by a specific user (admin only)
exports.getUserItems = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const connection = await pool.getConnection();
    try {
      // Check if user exists
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
          statusCode: 404
        });
      }

      const [items] = await connection.execute(
        'SELECT * FROM inventory_items WHERE created_by = ? ORDER BY created_at DESC',
        [userId]
      );

      res.status(200).json({
        success: true,
        data: items,
        totalItems: items.length,
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Delete any item (admin only)
exports.deleteItemAsAdmin = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const connection = await pool.getConnection();
    try {
      const [items] = await connection.execute(
        'SELECT id FROM inventory_items WHERE id = ?',
        [itemId]
      );

      if (items.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found.',
          statusCode: 404
        });
      }

      await connection.execute('DELETE FROM inventory_items WHERE id = ?', [itemId]);

      res.status(200).json({
        success: true,
        message: 'Item deleted by admin.',
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Get inventory statistics (admin only)
exports.getStatistics = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [stats] = await connection.execute(`
        SELECT 
          COUNT(DISTINCT id) as total_items,
          COUNT(DISTINCT created_by) as total_users,
          SUM(quantity) as total_quantity,
          AVG(price) as avg_price,
          MAX(price) as max_price,
          MIN(price) as min_price
        FROM inventory_items
      `);

      res.status(200).json({
        success: true,
        data: stats[0],
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};
