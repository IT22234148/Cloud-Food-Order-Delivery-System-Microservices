// Backend/restaurant-management-service/src/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/:restaurantId/menu', menuController.getMenuItems);
router.get('/:restaurantId/menu/category/:category', menuController.getMenuItemsByCategory);

// Protected routes - Restaurant owner
router.post('/', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), restaurantController.registerRestaurant);
router.get('/owner/me', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), restaurantController.getRestaurantByOwner);
router.put('/owner/me', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), restaurantController.updateRestaurant);
router.put('/owner/toggle-availability', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), restaurantController.toggleAvailability);

// Menu routes
router.post('/menu', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), menuController.addMenuItem);
router.put('/menu/:itemId', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), menuController.updateMenuItem);
router.delete('/menu/:itemId', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), menuController.deleteMenuItem);
router.put('/menu/:itemId/toggle-availability', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant'), menuController.toggleMenuItemAvailability);

// Admin routes
router.get('/admin/all', authMiddleware.protect, authMiddleware.authorizeRoles('admin'), restaurantController.getAllRestaurantsForAdmin);
router.put('/admin/:id/verify', authMiddleware.protect, authMiddleware.authorizeRoles('admin'), restaurantController.verifyRestaurant);

module.exports = router;