const Payment = require('../models/Payment');
const { createStripePaymentIntent } = require('../services/stripeService');

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

// Confirm payment success (Stripe webhook will call this eventually in real)
exports.confirmCardPayment = async (req, res) => {
  const { paymentIntentId } = req.body;
  const userId = req.user.id;

  try {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) return res.status(404).json({ msg: 'Payment not found' });

    payment.status = 'paid';
    await payment.save();

    // Optional: Notify order-service or notification-service

    res.status(200).json({ msg: 'Payment confirmed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to confirm payment' });
  }
};
