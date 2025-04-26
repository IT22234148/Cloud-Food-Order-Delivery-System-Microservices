// controllers/menuitem.controller.js
const MenuItem = require('../models/menuitem.model');
const Restaurant = require('../models/restaurant.model');

exports.addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant || restaurant.ownerId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Restaurant not found or you are not the owner' });
    }
    const newMenuItem = new MenuItem(req.body);
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.body.restaurantId },
      req.body,
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found or does not belong to your restaurant' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({ _id: req.params.id, restaurantId: req.body.restaurantId });
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found or does not belong to your restaurant' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMenuItemsByRestaurant = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId, isAvailable: true });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMenuItemsByOwner = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this owner' });
    }
    const menuItems = await MenuItem.find({ restaurantId: restaurant._id });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
