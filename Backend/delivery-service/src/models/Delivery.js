import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  deliveryId: String,
  orderId: String,
  assignedDriverId: String,
  status: {
    type: String,
    enum: ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'DELIVERED'],
    default: 'ASSIGNED'
  },
  deliveryAddress: String,
  deliveryTime: Date
}, { timestamps: true });

export default mongoose.model('Delivery', deliverySchema);
