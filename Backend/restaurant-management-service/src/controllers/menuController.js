// Backend/restaurant-management-service/src/controllers/menuController.js
const Restaurant = require('../models/Restaurant');

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, price, category, preparationTime, image } = req.body;
    
    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    const newMenuItem = {
      name,
      description,
      price,
      category,
      preparationTime,
      image,
      available: true
    };
    
    restaurant.menuItems.push(newMenuItem);
    await restaurant.save();
    
    res.status(201).json(restaurant.menuItems[restaurant.menuItems.length - 1]);
  } catch (err) {
    console.error('Error in addMenuItem:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { name, description, price, category, available, preparationTime, image } = req.body;
    
    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    const menuItemIndex = restaurant.menuItems.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (menuItemIndex === -1) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    
    // Update fields if provided
    if (name) restaurant.menuItems[menuItemIndex].name = name;
    if (description) restaurant.menuItems[menuItemIndex].description = description;
    if (price) restaurant.menuItems[menuItemIndex].price = price;
    if (category) restaurant.menuItems[menuItemIndex].category = category;
    if (available !== undefined) restaurant.menuItems[menuItemIndex].available = available;
    if (preparationTime) restaurant.menuItems[menuItemIndex].preparationTime = preparationTime;
    if (image) restaurant.menuItems[menuItemIndex].image = image;
    
    await restaurant.save();
    res.json(restaurant.menuItems[menuItemIndex]);
  } catch (err) {
    console.error('Error in updateMenuItem:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    const menuItemIndex = restaurant.menuItems.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (menuItemIndex === -1) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    
    restaurant.menuItems.splice(menuItemIndex, 1);
    await restaurant.save();
    
    res.json({ msg: 'Menu item removed' });
  } catch (err) {
    console.error('Error in deleteMenuItem:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Toggle menu item availability
exports.toggleMenuItemAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    const menuItemIndex = restaurant.menuItems.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (menuItemIndex === -1) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    
    restaurant.menuItems[menuItemIndex].available = !restaurant.menuItems[menuItemIndex].available;
    await restaurant.save();
    
    res.json({ available: restaurant.menuItems[menuItemIndex].available });
  } catch (err) {
    console.error('Error in toggleMenuItemAvailability:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all menu items for a restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    res.json(restaurant.menuItems);
  } catch (err) {
    console.error('Error in getMenuItems:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const { restaurantId, category } = req.params;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    const filteredItems = restaurant.menuItems.filter(item => item.category === category);
    res.json(filteredItems);
  } catch (err) {
    console.error('Error in getMenuItemsByCategory:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};