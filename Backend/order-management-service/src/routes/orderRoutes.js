// Backend/order-management-service/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Customer routes
router.post('/', authMiddleware.protect, authMiddleware.authorizeRoles('customer'), orderController.createOrder);
router.get('/me', authMiddleware.protect, authMiddleware.authorizeRoles('customer'), orderController.getCustomerOrders);
router.put('/:orderId/cancel', authMiddleware.protect, authMiddleware.authorizeRoles('customer'), orderController.cancelOrder);
router.get('/track/:orderId', orderController.trackOrder); // Public route for order tracking

// Restaurant routes
router.get('/restaurant/:restaurantId', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant', 'admin'), orderController.getRestaurantOrders);
router.get('/restaurant/:restaurantId/active', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant', 'admin'), orderController.getActiveRestaurantOrders);
router.put('/:orderId/status', authMiddleware.protect, authMiddleware.authorizeRoles('restaurant', 'delivery', 'admin'), orderController.updateOrderStatus);

// Delivery personnel routes
router.get('/delivery/me', authMiddleware.protect, authMiddleware.authorizeRoles('delivery'), orderController.getDeliveryPersonnelOrders);
router.put('/:orderId/delivery-time', authMiddleware.protect, authMiddleware.authorizeRoles('delivery', 'admin'), orderController.updateEstimatedDeliveryTime);

// Admin routes
router.get('/admin/all', authMiddleware.protect, authMiddleware.authorizeRoles('admin'), orderController.getAllOrders);
router.put('/:orderId/assign-delivery', authMiddleware.protect, authMiddleware.authorizeRoles('admin', 'delivery_service'), orderController.assignDeliveryPersonnel);

// Get specific order details - accessible by customer, restaurant owner, delivery person, and admin
router.get('/:orderId', authMiddleware.protect, orderController.getOrderById);

module.exports = router;