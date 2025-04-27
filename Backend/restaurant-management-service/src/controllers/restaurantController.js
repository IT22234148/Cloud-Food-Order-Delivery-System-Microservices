// Backend/restaurant-management-service/src/controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');
const axios = require('axios');

// Helper function to check if user is the restaurant owner
const isRestaurantOwner = async (restaurantId, userId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  return restaurant && restaurant.owner.toString() === userId.toString();
};

exports.registerRestaurant = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      cuisine,
      openingHours,
      bankDetails
    } = req.body;

    // Get user ID from the JWT token (sent by auth middleware)
    const userId = req.user.id;

    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: userId });
    if (existingRestaurant) {
      return res.status(400).json({ msg: 'User already owns a restaurant' });
    }

    const newRestaurant = new Restaurant({
      name,
      owner: userId,
      email,
      phone,
      address,
      cuisine,
      openingHours,
      bankDetails,
      available: true,
      menuItems: [],
      verified: false
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error('Error in registerRestaurant:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getRestaurantByOwner = async (req, res) => {
  try {
    const userId = req.user.id;
    const restaurant = await Restaurant.findOne({ owner: userId });
    
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (err) {
    console.error('Error in getRestaurantByOwner:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      phone,
      address,
      cuisine,
      openingHours,
      available,
      bankDetails
    } = req.body;

    const restaurant = await Restaurant.findOne({ owner: userId });
    
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    // Update fields if provided
    if (name) restaurant.name = name;
    if (email) restaurant.email = email;
    if (phone) restaurant.phone = phone;
    if (address) restaurant.address = address;
    if (cuisine) restaurant.cuisine = cuisine;
    if (openingHours) restaurant.openingHours = openingHours;
    if (available !== undefined) restaurant.available = available;
    if (bankDetails) restaurant.bankDetails = bankDetails;

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.error('Error in updateRestaurant:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ verified: true })
      .select('-bankDetails') // Exclude sensitive information
      .sort({ createdAt: -1 });
    
    res.json(restaurants);
  } catch (err) {
    console.error('Error in getAllRestaurants:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .select('-bankDetails'); // Exclude sensitive information
    
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (err) {
    console.error('Error in getRestaurantById:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Admin functions
exports.getAllRestaurantsForAdmin = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    console.error('Error in getAllRestaurantsForAdmin:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.verifyRestaurant = async (req, res) => {
  try {
    const { verified } = req.body;
    
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    restaurant.verified = verified;
    await restaurant.save();
    
    res.json(restaurant);
  } catch (err) {
    console.error('Error in verifyRestaurant:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Toggle restaurant availability
exports.toggleAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const restaurant = await Restaurant.findOne({ owner: userId });
    
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    restaurant.available = !restaurant.available;
    await restaurant.save();
    
    res.json({ available: restaurant.available });
  } catch (err) {
    console.error('Error in toggleAvailability:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};