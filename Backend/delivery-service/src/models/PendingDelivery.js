import mongoose from 'mongoose';

const PendingDeliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  orderLocation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PendingDelivery = mongoose.model('PendingDelivery', PendingDeliverySchema);
export default PendingDelivery;
