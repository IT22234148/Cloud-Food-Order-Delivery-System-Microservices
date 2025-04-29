// controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private (Restaurant Admin)
const createRestaurant = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      address, 
      phoneNumber, 
      cuisine, 
      operatingHours,
      imageUrl 
    } = req.body;

    // Create new restaurant
    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      phoneNumber,
      cuisine,
      operatingHours,
      imageUrl: imageUrl || '',
      ownerId: req.user.id // User ID from auth middleware
    });
    
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error creating restaurant:', error.message);
    
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

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get restaurants owned by the authenticated user
// @route   GET /api/restaurants/my-restaurants
// @access  Private (Restaurant Admin)
const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.user.id });
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get a single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error getting restaurant:', error.message);
    
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

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Restaurant Admin)
const updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Check if restaurant belongs to the authenticated user
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }
    
    // Update restaurant
    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error updating restaurant:', error.message);
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

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Restaurant Admin)
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Check if restaurant belongs to the authenticated user
    if (restaurant.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this restaurant'
      });
    }
    
    // Delete associated food items first
    await FoodItem.deleteMany({ restaurantId: req.params.id });
    
    // Delete restaurant
    await Restaurant.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Restaurant and all associated food items deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all food items for a specific restaurant
// @route   GET /api/restaurants/:id/food-items
// @access  Public
const getRestaurantFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ 
      restaurantId: req.params.id,
      isAvailable: true 
    });
    
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
  createRestaurant,
  getAllRestaurants,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantFoodItems
};