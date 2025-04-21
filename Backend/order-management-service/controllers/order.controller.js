// controllers/order.controller.js
const Order = require('../models/order.model');
const OrderItem = require('../models/orderitem.model');
// To communicate with the Restaurant Management Service
// direct model access or a service to fetch restaurant/menu data
const Restaurant = require('../../restaurant-management-service/models/restaurant.model');
const MenuItem = require('../../restaurant-management-service/models/menuitem.model');

exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, contactNumber, paymentMethod } = req.body;

    // Verify restaurant exists and is available
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isAvailable) {
      return res.status(404).json({ message: 'Restaurant not found or is currently unavailable' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Fetch menu item details and validate them
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable || menuItem.restaurantId.toString() !== restaurantId) {
        return res.status(400).json({ message: `Menu item not found or unavailable: ${item.menuItemId}` });
      }
      const orderItem = new OrderItem({
        orderId: null, // Will be set after order creation
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      });
      orderItems.push(orderItem);
      totalAmount += menuItem.price * item.quantity;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in the order' });
    }

    const newOrder = new Order({
      customerId: req.user.id,
      restaurantId,
      items: [], // Will be populated with order item IDs
      totalAmount,
      deliveryAddress,
      contactNumber,
      paymentMethod,
      orderStatus: 'pending',
      paymentStatus: 'pending',
    });

    const savedOrder = await newOrder.save();

    // Save order items with the order ID
    const savedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        item.orderId = savedOrder._id;
        return await item.save();
      })
    );

    // Update the order with the saved order item IDs
    savedOrder.items = savedOrderItems.map((item) => item._id);
    await savedOrder.save();

    // TODO: Integrate with Payment and Notification services (e.g., emit an event)

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items')
      .populate('restaurantId', 'name address')
      .populate('deliveryDriverId', 'username');
    if (!order || order.customerId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.customerId.toString() !== req.user.id || order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Cannot update order that is not pending or unauthorized' });
    }

    // Allow only specific updates before confirmation
    const allowedUpdates = ['deliveryAddress', 'contactNumber', 'paymentMethod'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restaurant Admin role - Get orders for their restaurant
exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this owner' });
    }
    const orders = await Order.find({ restaurantId: restaurant._id })
      .populate('customerId', 'username email')
      .populate('items')
      .sort({ createdAt: -1 }); // Show latest orders first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restaurant Admin role - Update order status (e.g., accept, process, ready for delivery)
exports.updateOrderStatusByRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this owner' });
    }
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurantId: restaurant._id },
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found for this restaurant' });
    }
    // TODO: Potentially trigger notifications to customer/delivery
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery Personnel role - Get assigned orders
exports.getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryDriverId: req.user.id, orderStatus: { $in: ['processing', 'out_for_delivery'] } })
      .populate('customerId', 'username email')
      .populate('restaurantId', 'name address')
      .populate('items')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery Personnel role - Update order status (e.g., out for delivery, delivered)
exports.updateOrderStatusByDelivery = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, deliveryDriverId: req.user.id },
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found or not assigned to you' });
    }
    // TODO: Potentially trigger notifications to customer
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer role - Get order history
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('restaurantId', 'name')
      .populate('items')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
