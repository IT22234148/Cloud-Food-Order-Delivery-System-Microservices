// models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Restaurant address is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Restaurant phone number is required'],
    trim: true
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  operatingHours: {
    open: {
      type: String,
      required: [true, 'Opening time is required']
    },
    close: {
      type: String,
      required: [true, 'Closing time is required']
    }
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    averageRating: {
      type: Number,
      default: 0
    },
    numberOfRatings: {
      type: Number,
      default: 0
    }
  },
  ownerId: {
    type: String,
    required: [true, 'Restaurant owner ID is required'],
    trim: true
  }
}, {
  timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;