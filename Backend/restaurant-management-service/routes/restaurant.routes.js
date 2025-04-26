const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { protect, authorizeRoles } = require('../../auth-service/src/middlewares/authMiddleware'); // Adjust path as needed

// Restaurant Owner routes (protected)
router.post('/', protect, authorizeRoles('restaurant'), restaurantController.createRestaurant);
router.get('/owner', protect, authorizeRoles('restaurant'), restaurantController.getRestaurantByOwner);
router.put('/:id', protect, authorizeRoles('restaurant'), restaurantController.updateRestaurant);
router.delete('/:id', protect, authorizeRoles('restaurant'), restaurantController.deleteRestaurant);

// Admin routes (protected)
router.get('/admin/all', protect, authorizeRoles('admin'), restaurantController.getAllRestaurantsAdmin);
router.patch('/admin/:id/verify', protect, authorizeRoles('admin'), restaurantController.verifyRestaurant);

module.exports = router;