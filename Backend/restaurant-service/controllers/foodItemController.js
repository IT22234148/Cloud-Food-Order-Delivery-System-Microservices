// controllers/foodItemController.js
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// @desc    Create a new food item
// @route   POST /api/restaurants/:restaurantId/food-items
// @access  Private (Restaurant Admin)
const createFoodItem = async (req, res) => {
  try {
    const { title, description, category, price, imageUrl, isAvailable } = req.body;
    const { restaurantId } = req.params;
    
    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Check if the user owns the restaurant
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add food items to this restaurant'
      });
    }
    
    // Create new food item
    const foodItem = await FoodItem.create({
      title,
      description,
      category,
      price: price || 0,
      imageUrl: imageUrl || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      restaurantId,
      createdBy: req.user.id // User ID from auth middleware
    });
    
    res.status(201).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    console.error('Error creating food item:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all food items across all restaurants - for admins
// @route   GET /api/food-items
// @access  Private (Admin)
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find().populate('restaurantId', 'name');
    
    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all food items for a restaurant - for restaurant admin
// @route   GET /api/restaurants/:restaurantId/food-items/admin
// @access  Private (Restaurant Admin)
const getRestaurantFoodItemsAdmin = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Check if the user owns the restaurant
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view food items for this restaurant'
      });
    }
    
    const foodItems = await FoodItem.find({ restaurantId });
    
    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get a single food item by ID
// @route   GET /api/food-items/:id
// @access  Public
const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id)
      .populate('restaurantId', 'name address phoneNumber');
    
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    console.error('Error getting food item:', error.message);
    
    // Handle MongoDB validation errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update a food item
// @route   PUT /api/food-items/:id
// @access  Private (Restaurant Admin)
const updateFoodItem = async (req, res) => {
  try {
    let foodItem = await FoodItem.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }
    
    // Get the restaurant to check ownership
    const restaurant = await Restaurant.findById(foodItem.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Associated restaurant not found'
      });
    }
    
    // Check if restaurant belongs to the authenticated user
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this food item'
      });
    }
    
    // Update food item
    foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    console.error('Error updating food item:', error.message);
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/food-items/:id
// @access  Private (Restaurant Admin)
const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }
    
    // Get the restaurant to check ownership
    const restaurant = await Restaurant.findById(foodItem.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Associated restaurant not found'
      });
    }
    
    // Check if restaurant belongs to the authenticated user
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this food item'
      });
    }
    
    await FoodItem.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting food item:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all public food items across all restaurants
// @route   GET /api/food-items/public
// @access  Public
const getPublicFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ isAvailable: true })
      .populate('restaurantId', 'name imageUrl');
    
    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createFoodItem,
  getAllFoodItems,
  getRestaurantFoodItemsAdmin,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
  getPublicFoodItems
};