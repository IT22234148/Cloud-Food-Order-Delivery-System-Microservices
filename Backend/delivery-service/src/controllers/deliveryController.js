import Delivery from '../models/Delivery.js';
import { notifyCustomer, notifyDriver } from '../utils/notify.js';

export async function assignDelivery(req, res) {
  const { orderId, deliveryAddress } = req.body;

  // Mock: Get first available driver (in real app, use availability check)
  const driverId = "DRV" + Math.floor(Math.random() * 1000);

  const delivery = new Delivery({
    deliveryId: "DEL" + Math.floor(Math.random() * 10000),
    orderId,
    assignedDriverId: driverId,
    status: "ASSIGNED",
    deliveryAddress,
    deliveryTime: new Date()
  });

  await delivery.save();
  notifyDriver(driverId, orderId);

  res.status(200).json(delivery);
}

export async function updateDelivery(req, res) {
  const { orderId } = req.params;
  const { status } = req.body;

  const delivery = await Delivery.findOne({ orderId });
  if (!delivery) return res.status(404).send('Not found');

  delivery.status = status;
  await delivery.save();

  notifyCustomer(orderId, status);
  res.status(200).json({ message: "Updated", delivery });
}

export async function getStatus(req, res) {
  const { orderId } = req.params;
  const delivery = await Delivery.findOne({ orderId });
  if (!delivery) return res.status(404).send('Not found');

  res.status(200).json(delivery);
}

export async function getDriverDeliveries(req, res) {
  const { driverId } = req.params;
  const deliveries = await Delivery.find({ assignedDriverId: driverId });
  res.status(200).json(deliveries);
}
