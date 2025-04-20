// routes/menuitem.routes.js
const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuitem.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Restaurant Owner routes (protected)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), menuItemController.addMenuItem);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), menuItemController.updateMenuItem);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), menuItemController.deleteMenuItem);
router.get('/owner/all', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), menuItemController.getMenuItemsByOwner);

// Public route to get menu items by restaurant
router.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant);

module.exports = router;
