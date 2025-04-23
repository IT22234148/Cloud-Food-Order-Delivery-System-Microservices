const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  amount: Number,
  method: { type: String, enum: ['card', 'cod'], default: 'card' },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  stripePaymentIntentId: String,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
