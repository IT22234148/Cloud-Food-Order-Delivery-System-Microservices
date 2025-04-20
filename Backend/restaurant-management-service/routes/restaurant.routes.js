// routes/restaurant.routes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Restaurant Owner routes (protected)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), restaurantController.createRestaurant);
router.get('/owner', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), restaurantController.getRestaurantByOwner);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), restaurantController.updateRestaurant);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), restaurantController.deleteRestaurant);

// Admin routes (protected)
router.get('/admin/all', authMiddleware.authenticate, authMiddleware.authorize(['admin']), restaurantController.getAllRestaurantsAdmin);
router.patch('/admin/:id/verify', authMiddleware.authenticate, authMiddleware.authorize(['admin']), restaurantController.verifyRestaurant);

module.exports = router;
