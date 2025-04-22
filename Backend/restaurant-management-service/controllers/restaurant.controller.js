// controllers/restaurant.controller.js
const Restaurant = require('../models/restaurant.model');

// Restaurant Owner Role
exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant({ ...req.body, ownerId: req.user.id });
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, req.body, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or you are not the owner' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or you are not the owner' });
    }
    // Optionally, also delete associated menu items
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantByOwner = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Role
exports.getAllRestaurantsAdmin = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('ownerId', 'username email');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
