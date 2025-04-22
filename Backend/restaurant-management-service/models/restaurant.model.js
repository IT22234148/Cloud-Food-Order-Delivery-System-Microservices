// models/restaurant.model.js
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user who owns the restaurant
  address: { type: String, required: true },
  contactNumber: { type: String },
  isAvailable: { type: Boolean, default: true },
  // Add other relevant fields like opening hours, cuisine types, etc.
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
