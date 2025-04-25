import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  driverId: { type: String, required: true },
  customerId: { type: String, required: true }, // Add customerId field
  status: { type: String, enum: ['Assigned', 'In_transit', 'Delivered'], default: 'assigned' },
  currentLocation: { type: String }, // Change to string for normal location
  updatedAt: { type: Date, default: Date.now },
  driverAvailability: { type: Boolean, default: true }, // Track driver availability
  driverLocation: {
    lat: Number,
    lng: Number,
  },
});

const Delivery = mongoose.model('Delivery', DeliverySchema);
export default Delivery;