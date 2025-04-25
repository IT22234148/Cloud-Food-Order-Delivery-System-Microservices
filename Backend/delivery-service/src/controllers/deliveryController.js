import mongoose from 'mongoose';
import Delivery from '../models/Delivery.js';
import Driver from '../models/Driver.js';
import PendingDelivery from '../models/PendingDelivery.js';

export const assignDelivery = async (req, res) => {
  if (req.user.role !== 'delivery') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { orderId, customerId, orderLocation } = req.body;
  if (!orderId || !customerId || !orderLocation) {
    return res.status(400).json({ error: 'Missing orderId, customerId, or orderLocation' });
  }
  try {
    // Find the first available driver
    const nearestDriver = await Driver.findOne({ driverAvailability: true });

    if (!nearestDriver) {
      console.warn('No available drivers found. Adding delivery to the pending queue.');
      const pendingDelivery = new PendingDelivery({ orderId, customerId, orderLocation });
      await pendingDelivery.save();
      return res.status(202).json({
        message: 'No available drivers. Your delivery has been added to the pending queue.',
      });
    }

    // Ensure the driverId is correctly retrieved
    const driverId = nearestDriver.driverId;
    if (!driverId) {
      return res.status(500).json({ error: 'Driver ID is missing for the selected driver' });
    }

    // Assign the delivery to the nearest driver
    const delivery = new Delivery({
      orderId,
      customerId,
      driverId,
      status: 'Assigned',
      currentLocation: orderLocation,
    });
    await delivery.save();

    // Update driver availability
    nearestDriver.driverAvailability = false;
    await nearestDriver.save();

    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDelivery = async (req, res) => {
  if (req.user.role !== 'delivery') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { orderId: req.params.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    // Reset driver availability if the delivery is marked as delivered
    if (req.body.status === 'delivered') {
      await Driver.findOneAndUpdate(
        { driverId: delivery.driverId },
        { driverAvailability: true }
      );
    }

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.id });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    // Ensure customers can only access their own orders
    if (req.user.role === 'customer' && delivery.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to this order' });
    }

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDeliveriesByDriver = async (req, res) => {
  if (req.user.role !== 'delivery') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const deliveries = await Delivery.find({ driverId: req.params.driverId });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
