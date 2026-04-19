const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(isAuthenticated);
router.use(isAdmin);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.get('/users/:userId/items', adminController.getUserItems);

// Item management
router.delete('/items/:itemId', adminController.deleteItemAsAdmin);

// Statistics
router.get('/statistics', adminController.getStatistics);

module.exports = router;
