const { pool } = require('../db');

// CREATE - Add new inventory item
exports.createItem = async (req, res, next) => {
  try {
    const { name, description, quantity, price, category } = req.body;
    const userId = req.session.userId;

    // Validation
    if (!name || quantity === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, quantity, and category are required.',
        statusCode: 400
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative.',
        statusCode: 400
      });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO inventory_items (name, description, quantity, price, category, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description || null, quantity, price || null, category, userId]
      );

      res.status(201).json({
        success: true,
        message: 'Item created successfully.',
        itemId: result.insertId,
        statusCode: 201
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// READ - Get all inventory items (with pagination)
exports.getAllItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    try {
      // Get total count
      const [[{ total }]] = await connection.execute(
        'SELECT COUNT(*) as total FROM inventory_items'
      );

      // Get items with pagination
      const [items] = await connection.execute(
        'SELECT * FROM inventory_items ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// READ - Get single item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    try {
      const [items] = await connection.execute(
        'SELECT * FROM inventory_items WHERE id = ?',
        [id]
      );

      if (items.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found.',
          statusCode: 404
        });
      }

      res.status(200).json({
        success: true,
        data: items[0],
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update inventory item (only admin or creator)
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price, category } = req.body;
    const userId = req.session.userId;
    const isAdmin = req.session.role === 'admin';

    const connection = await pool.getConnection();
    try {
      // Check if item exists and verify ownership
      const [items] = await connection.execute(
        'SELECT created_by FROM inventory_items WHERE id = ?',
        [id]
      );

      if (items.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found.',
          statusCode: 404
        });
      }

      // Authorization check: only admin or creator can update
      if (!isAdmin && items[0].created_by !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You can only update items you created.',
          statusCode: 403
        });
      }

      // Quantity validation
      if (quantity !== undefined && quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity cannot be negative.',
          statusCode: 400
        });
      }

      // Build update query dynamically
      const updates = [];
      const values = [];

      if (name !== undefined) { updates.push('name = ?'); values.push(name); }
      if (description !== undefined) { updates.push('description = ?'); values.push(description); }
      if (quantity !== undefined) { updates.push('quantity = ?'); values.push(quantity); }
      if (price !== undefined) { updates.push('price = ?'); values.push(price); }
      if (category !== undefined) { updates.push('category = ?'); values.push(category); }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update.',
          statusCode: 400
        });
      }

      values.push(id);
      const query = `UPDATE inventory_items SET ${updates.join(', ')} WHERE id = ?`;

      await connection.execute(query, values);

      res.status(200).json({
        success: true,
        message: 'Item updated successfully.',
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete inventory item (only admin or creator)
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    const isAdmin = req.session.role === 'admin';

    const connection = await pool.getConnection();
    try {
      // Check if item exists and verify ownership
      const [items] = await connection.execute(
        'SELECT created_by FROM inventory_items WHERE id = ?',
        [id]
      );

      if (items.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found.',
          statusCode: 404
        });
      }

      // Authorization check: only admin or creator can delete
      if (!isAdmin && items[0].created_by !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You can only delete items you created.',
          statusCode: 403
        });
      }

      await connection.execute('DELETE FROM inventory_items WHERE id = ?', [id]);

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully.',
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Get items by category (public read)
exports.getItemsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    try {
      const [[{ total }]] = await connection.execute(
        'SELECT COUNT(*) as total FROM inventory_items WHERE category = ?',
        [category]
      );

      const [items] = await connection.execute(
        'SELECT * FROM inventory_items WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [category, limit, offset]
      );

      res.status(200).json({
        success: true,
        data: items,
        category,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

// Record an inventory movement and update item quantity
exports.addItemMovement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { change_quantity, note } = req.body;
    const userId = req.session.userId;
    const isAdmin = req.session.role === 'admin';
    const quantityChange = Number(change_quantity);

    if (change_quantity === undefined || Number.isNaN(quantityChange) || !Number.isInteger(quantityChange)) {
      return res.status(400).json({
        success: false,
        message: 'An integer change_quantity value is required.',
        statusCode: 400
      });
    }

    const connection = await pool.getConnection();
    try {
      const [items] = await connection.execute(
        'SELECT created_by, quantity FROM inventory_items WHERE id = ?',
        [id]
      );

      if (items.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found.',
          statusCode: 404
        });
      }

      if (!isAdmin && items[0].created_by !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You can only log movements for your own items.',
          statusCode: 403
        });
      }

      const currentQuantity = Number(items[0].quantity || 0);
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity update would result in a negative inventory count.',
          statusCode: 400
        });
      }

      await connection.execute(
        'UPDATE inventory_items SET quantity = ? WHERE id = ?',
        [newQuantity, id]
      );

      const [result] = await connection.execute(
        'INSERT INTO item_movements (item_id, user_id, change_quantity, note) VALUES (?, ?, ?, ?)',
        [id, userId, quantityChange, note || null]
      );

      res.status(201).json({
        success: true,
        message: 'Item movement recorded successfully.',
        movementId: result.insertId,
        itemId: Number(id),
        statusCode: 201
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};

exports.getItemMovements = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    const isAdmin = req.session.role === 'admin';

    const connection = await pool.getConnection();
    try {
      const [items] = await connection.execute(
        'SELECT created_by FROM inventory_items WHERE id = ?',
        [id]
      );

      if (items.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Item not found.',
          statusCode: 404
        });
      }

      if (!isAdmin && items[0].created_by !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You can only view movements for your own items.',
          statusCode: 403
        });
      }

      const [movements] = await connection.execute(
        `SELECT m.id, m.item_id, m.user_id, u.username AS recorded_by, m.change_quantity, m.note, m.created_at
         FROM item_movements m
         JOIN users u ON m.user_id = u.id
         WHERE m.item_id = ?
         ORDER BY m.created_at DESC`,
        [id]
      );

      res.status(200).json({
        success: true,
        data: movements,
        statusCode: 200
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
};
