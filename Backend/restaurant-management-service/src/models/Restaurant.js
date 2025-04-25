// Backend/restaurant-management-service/src/models/Restaurant.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
  preparationTime: { type: Number, required: true }, // in minutes
}, { timestamps: true });

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  cuisine: [{ type: String, required: true }],
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  available: { type: Boolean, default: true },
  menuItems: [menuItemSchema],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }, // Used by admin to verify restaurant
  bankDetails: {
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    branchCode: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);