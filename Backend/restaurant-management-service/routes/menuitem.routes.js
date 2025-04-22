const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuitem.controller');
const { protect, authorizeRoles } = require('../../auth-service/src/middlewares/authMiddleware'); // Adjust path as needed

// Restaurant Owner routes (protected)
router.post('/', protect, authorizeRoles('restaurant'), menuItemController.addMenuItem);
router.put('/:id', protect, authorizeRoles('restaurant'), menuItemController.updateMenuItem);
router.delete('/:id', protect, authorizeRoles('restaurant'), menuItemController.deleteMenuItem);
router.get('/owner/all', protect, authorizeRoles('restaurant'), menuItemController.getMenuItemsByOwner);

// Public route to get menu items by restaurant
router.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant);

module.exports = router;