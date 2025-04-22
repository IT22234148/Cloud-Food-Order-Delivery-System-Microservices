// order-management-service/models/orderitem.model.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem', // Assuming a MenuItem model in Restaurant Management Service
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  // You might want to include additional details like customization options here
}, {
  timestamps: false, // Order items are tied to the order's timestamp
});

module.exports = mongoose.model('OrderItem', orderItemSchema);