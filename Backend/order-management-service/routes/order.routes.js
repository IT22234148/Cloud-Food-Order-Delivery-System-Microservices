const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorizeRoles } = require('../../auth-service/middlewares/authMiddleware'); // Adjust path as needed

// Customer routes (protected)
router.post('/', protect, authorizeRoles('customer'), orderController.placeOrder);
router.get('/:id', protect, authorizeRoles('customer'), orderController.getOrderById);
router.put('/:id', protect, authorizeRoles('customer'), orderController.updateOrder);
router.get('/history', protect, authorizeRoles('customer'), orderController.getOrderHistory);

// Restaurant Admin routes (protected)
router.get('/restaurant/orders', protect, authorizeRoles('restaurant'), orderController.getRestaurantOrders);
router.patch('/restaurant/:id/status', protect, authorizeRoles('restaurant'), orderController.updateOrderStatusByRestaurant);

// Delivery Personnel routes (protected)
router.get('/delivery/assigned', protect, authorizeRoles('delivery'), orderController.getAssignedOrders);
router.patch('/delivery/:id/status', protect, authorizeRoles('delivery'), orderController.updateOrderStatusByDelivery);

module.exports = router;