import { sendEmail } from '../services/emailService.js';
import { sendWhatsApp } from '../services/smsService.js';

export async function sendCustomerConfirmation(req, res) {
  const { email, phone, orderId, customerName } = req.body;

  const msg = `Hi ${customerName}, your order #${orderId} was successfully placed.`;
  try {
    await sendEmail(email, "Order Confirmation", msg);
    await sendWhatsApp(phone, msg);
    res.status(200).json({ message: 'Customer confirmation sent' });
  } catch (error) {
    console.error('Error sending customer confirmation:', error);
    res.status(500).json({ error: 'Failed to send customer confirmation' });
  }
}

export async function sendDriverAssignment(req, res) {
  const { email, phone, orderId, pickupLocation } = req.body;

  const msg = `You have been assigned to Order #${orderId}. Pickup at: ${pickupLocation}`;
  try {
    await sendEmail(email, "New Delivery Assignment", msg);
    await sendWhatsApp(phone, msg);
    res.status(200).json({ message: 'Driver assignment notification sent' });
  } catch (error) {
    console.error('Error sending driver assignment notification:', error.message);
    res.status(500).json({ error: error.message || 'Failed to send driver assignment notification' });
  }
}