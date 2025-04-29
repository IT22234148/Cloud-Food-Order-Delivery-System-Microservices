const Payment = require('../models/Payment');
const { createStripePaymentIntent } = require('../services/stripeService');


// Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch payments' });
  }
};

// Card payment
exports.initiateCardPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  const userId = req.user.id;

  try {
    const paymentIntent = await createStripePaymentIntent(amount);

    const payment = new Payment({
      orderId,
      userId,
      amount,
      method: 'card',
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
    });

    await payment.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to initiate payment' });
  }
};

// COD
exports.initiateCOD = async (req, res) => {
  const { orderId, amount } = req.body;
  const userId = req.user.id;

  try {
    const payment = new Payment({
      orderId,
      userId,
      amount,
      method: 'cod',
      status: 'pending',
    });

    await payment.save();

    res.status(200).json({ msg: 'COD order registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to register COD order' });
  }
};


exports.confirmCardPayment = async (req, res) => {
  const { paymentIntentId } = req.body;
  const userId = req.user.id;

  try {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) return res.status(404).json({ msg: 'Payment not found' });

    payment.status = 'paid';
    await payment.save();

    res.status(200).json({ msg: 'Payment confirmed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to confirm payment' });
  }
};


exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body;
  const paymentId = req.params.id;

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    res.status(200).json({ msg: 'Payment status updated successfully', payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update payment status' });
  }
};

exports.deletePayment = async (req, res) => {
  const paymentId = req.params.id;

  try {
    const payment = await Payment.findByIdAndDelete(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    res.status(200).json({ msg: 'Payment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete payment' });
  }
};





