const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const { isAuthenticated } = require('../middleware/auth');

// Public routes
router.get('/', itemsController.getAllItems);
router.get('/category/:category', itemsController.getItemsByCategory);
router.get('/:id', itemsController.getItemById);

// Protected routes (authenticated users only)
router.post('/', isAuthenticated, itemsController.createItem);
router.put('/:id', isAuthenticated, itemsController.updateItem);
router.delete('/:id', isAuthenticated, itemsController.deleteItem);

module.exports = router;
