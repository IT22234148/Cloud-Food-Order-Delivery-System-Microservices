// Backend/order-management-service/src/controllers/orderController.js
const Order = require('../models/Order');
const axios = require('axios');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      restaurant, 
      items, 
      totalAmount, 
      deliveryAddress,
      deliveryInstructions
    } = req.body;

    // Verify items and calculate total
    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'Order must contain at least one item' });
    }

    const newOrder = new Order({
      customer: userId,
      restaurant,
      items,
      totalAmount,
      deliveryAddress,
      deliveryInstructions,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await newOrder.save();

    // Notify the restaurant about the new order (this would typically use a message queue)
    // For demonstration, we're just logging it
    console.log(`New order ${newOrder._id} created for restaurant ${restaurant}`);

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error in createOrder:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all orders for a customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ customer: userId })
      .sort({ orderPlacedAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Error in getCustomerOrders:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check if the user is the customer, restaurant owner, or delivery personnel
    if (order.customer.toString() !== userId &&
        req.user.role !== 'admin' &&
        order.deliveryPersonnel?.toString() !== userId) {
      // For restaurant owners, we need to check if they own the restaurant
      if (req.user.role === 'restaurant') {
        // This would require a call to restaurant service to verify ownership
        // For now, we'll assume they can't access it
        return res.status(403).json({ msg: 'Not authorized to view this order' });
      }
      
      return res.status(403).json({ msg: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Error in getOrderById:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Only the customer can cancel their order
    if (order.customer.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to cancel this order' });
    }
    
    // Can only cancel if order is pending
    if (order.status !== 'pending') {
      return res.status(400).json({ msg: 'Order cannot be cancelled at this stage' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({ msg: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('Error in cancelOrder:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update order status - for restaurants and delivery personnel
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Check permissions based on role and requested status
    if (req.user.role === 'restaurant') {
      // Restaurant can only update to these statuses
      const allowedStatuses = ['accepted', 'preparing', 'ready', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status update for restaurant' });
      }
      
      // Check if user is the restaurant owner
      // This would require a call to restaurant service 
      // For now, we'll assume they are
    } else if (req.user.role === 'delivery') {
      // Delivery personnel can only update to these statuses
      const allowedStatuses = ['picked_up', 'delivered'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status update for delivery personnel' });
      }
      
      // Check if assigned to this delivery
      if (order.deliveryPersonnel?.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not assigned to this delivery' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update order status' });
    }
    
    order.status = status;
    
    // If the order is being marked as delivered, update delivery time
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    
    res.json({ msg: 'Order status updated successfully', order });
  } catch (err) {
console.error('Error in updateOrderStatus:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

// Get all restaurant orders
exports.getRestaurantOrders = async (req, res) => {
try {
const { restaurantId } = req.params;

// Verify the user owns this restaurant
// This would normally involve checking against the restaurant service
// For now, we'll assume they own it if they have restaurant role
if (req.user.role !== 'restaurant' && req.user.role !== 'admin') {
  return res.status(403).json({ msg: 'Not authorized to view these orders' });
}

const orders = await Order.find({ restaurant: restaurantId })
  .sort({ orderPlacedAt: -1 });

res.json(orders);
} catch (err) {
console.error('Error in getRestaurantOrders:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

// Get active restaurant orders (pending, accepted, preparing, ready)
exports.getActiveRestaurantOrders = async (req, res) => {
try {
const { restaurantId } = req.params;

// Verify the user owns this restaurant (same assumption as above)
if (req.user.role !== 'restaurant' && req.user.role !== 'admin') {
  return res.status(403).json({ msg: 'Not authorized to view these orders' });
}

const orders = await Order.find({
  restaurant: restaurantId,
  status: { $in: ['pending', 'accepted', 'preparing', 'ready'] }
}).sort({ orderPlacedAt: 1 });

res.json(orders);
} catch (err) {
console.error('Error in getActiveRestaurantOrders:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

// Get delivery personnel orders
exports.getDeliveryPersonnelOrders = async (req, res) => {
try {
const userId = req.user.id;

if (req.user.role !== 'delivery' && req.user.role !== 'admin') {
  return res.status(403).json({ msg: 'Not authorized to view these orders' });
}

const orders = await Order.find({
  deliveryPersonnel: userId,
  status: { $in: ['ready', 'picked_up'] }
}).sort({ orderPlacedAt: 1 });

res.json(orders);
} catch (err) {
console.error('Error in getDeliveryPersonnelOrders:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

// Assign delivery personnel to an order
exports.assignDeliveryPersonnel = async (req, res) => {
try {
const { orderId } = req.params;
const { deliveryPersonnelId } = req.body;

// Only admin or delivery service can assign
if (req.user.role !== 'admin' && req.user.role !== 'delivery_service') {
  return res.status(403).json({ msg: 'Not authorized to assign delivery personnel' });
}

const order = await Order.findById(orderId);
if (!order) {
  return res.status(404).json({ msg: 'Order not found' });
}

// Only assign if ready for pickup
if (order.status !== 'ready') {
  return res.status(400).json({ msg: 'Order not ready for delivery assignment' });
}

order.deliveryPersonnel = deliveryPersonnelId;
await order.save();

res.json({ msg: 'Delivery personnel assigned successfully', order });
} catch (err) {
console.error('Error in assignDeliveryPersonnel:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

// Update delivery estimated time
exports.updateEstimatedDeliveryTime = async (req, res) => {
try {
const { orderId } = req.params;
const { estimatedDeliveryTime } = req.body;

if (req.user.role !== 'delivery' && req.user.role !== 'admin') {
  return res.status(403).json({ msg: 'Not authorized to update delivery time' });
}

const order = await Order.findById(orderId);
if (!order) {
  return res.status(404).json({ msg: 'Order not found' });
}

if (order.deliveryPersonnel?.toString() !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ msg: 'Not assigned to this delivery' });
}

order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
await order.save();

res.json({ msg: 'Estimated delivery time updated', order });
} catch (err) {
console.error('Error in updateEstimatedDeliveryTime:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

// Get order tracking info
exports.trackOrder = async (req, res) => {
try {
const { orderId } = req.params;

const order = await Order.findById(orderId)
  .select('status restaurant customer deliveryPersonnel estimatedDeliveryTime orderPlacedAt');

if (!order) {
  return res.status(404).json({ msg: 'Order not found' });
}

res.json(order);
} catch (err) {
console.error('Error in trackOrder:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
try {
if (req.user.role !== 'admin') {
  return res.status(403).json({ msg: 'Not authorized to view all orders' });
}

const { status, limit = 50, page = 1 } = req.query;
const skip = (page - 1) * limit;

let query = {};
if (status) {
  query.status = status;
}

const orders = await Order.find(query)
  .sort({ orderPlacedAt: -1 })
  .skip(skip)
  .limit(parseInt(limit));

const total = await Order.countDocuments(query);

res.json({
  orders,
  pagination: {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  }
});
} catch (err) {
console.error('Error in getAllOrders:', err);
res.status(500).json({ msg: 'Server error', error: err.message });
}
};

module.exports = exports;