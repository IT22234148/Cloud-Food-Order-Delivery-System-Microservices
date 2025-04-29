// routes/restaurantRoutes.js
const express = require('express');
const { 
  createRestaurant,
  getAllRestaurants,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantFoodItems
} = require('../controllers/restaurantController');
const { 
  createFoodItem,
  getRestaurantFoodItemsAdmin
} = require('../controllers/foodItemController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/food-items', getRestaurantFoodItems);

// Protected routes - Restaurant Admin only
router.post('/', protect, authorize('restaurant-admin'), createRestaurant);
router.get('/user/my-restaurants', protect, authorize('restaurant-admin'), getMyRestaurants);
router.put('/:id', protect, authorize('restaurant-admin'), updateRestaurant);
router.delete('/:id', protect, authorize('restaurant-admin'), deleteRestaurant);

// Food items for a specific restaurant - Admin operations
router.post('/:restaurantId/food-items', protect, authorize('restaurant-admin'), createFoodItem);
router.get('/:restaurantId/food-items/admin', protect, authorize('restaurant-admin'), getRestaurantFoodItemsAdmin);

module.exports = router;