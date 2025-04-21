// routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Customer routes (protected)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['customer']), orderController.placeOrder);
router.get('/:id', authMiddleware.authenticate, authMiddleware.authorize(['customer']), orderController.getOrderById);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['customer']), orderController.updateOrder);
router.get('/history', authMiddleware.authenticate, authMiddleware.authorize(['customer']), orderController.getOrderHistory);

// Restaurant Admin routes (protected)
router.get('/restaurant/orders', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), orderController.getRestaurantOrders);
router.patch('/restaurant/:id/status', authMiddleware.authenticate, authMiddleware.authorize(['restaurant']), orderController.updateOrderStatusByRestaurant);

// Delivery Personnel routes (protected)
router.get('/delivery/assigned', authMiddleware.authenticate, authMiddleware.authorize(['delivery']), orderController.getAssignedOrders);
router.patch('/delivery/:id/status', authMiddleware.authenticate, authMiddleware.authorize(['delivery']), orderController.updateOrderStatusByDelivery);

module.exports = router;
