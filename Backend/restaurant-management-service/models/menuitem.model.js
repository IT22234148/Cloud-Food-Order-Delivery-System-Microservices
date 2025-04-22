// models/menuitem.model.js
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  isAvailable: { type: Boolean, default: true },
  // Add image URL or other details
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
