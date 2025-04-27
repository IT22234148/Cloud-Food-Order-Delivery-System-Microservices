import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import deliveryRoutes from './routes/delivery.js';
import dotenv from 'dotenv';
import Driver from './models/Driver.js'; // Import Driver model
import Delivery from './models/Delivery.js'; // Import Delivery model
import PendingDelivery from './models/PendingDelivery.js'; // Import PendingDelivery model

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

try {
  // Connect to MongoDB (options removed as deprecated)
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
} catch (err) {
  console.error('MongoDB connection error:', err);
}

app.use(express.json());
app.use('/api/delivery', deliveryRoutes);

// Seed initial driver data (optional)
const seedDrivers = async () => {
  try {
    const drivers = [
      { name: 'Driver 1', driverId: 'DR001', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-74.0060, 40.7128] } },
      { name: 'Driver 2', driverId: 'DR002', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-118.2437, 34.0522] } },
      { name: 'Driver 3', driverId: 'DR003', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-87.6298, 41.8781] } },
      { name: 'Driver 4', driverId: 'DR004', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-95.3698, 29.7604] } },
      { name: 'Driver 5', driverId: 'DR005', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-122.4194, 37.7749] } },
      { name: 'Driver 6', driverId: 'DR006', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-71.0589, 42.3601] } },
      { name: 'Driver 7', driverId: 'DR007', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-80.1918, 25.7617] } },
      { name: 'Driver 8', driverId: 'DR008', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-112.0740, 33.4484] } },
      { name: 'Driver 9', driverId: 'DR009', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-104.9903, 39.7392] } },
      { name: 'Driver 10', driverId: 'DR010', driverAvailability: true, driverLocation: { type: 'Point', coordinates: [-77.0369, 38.9072] } }
    ];
    await Driver.deleteMany({});
    await Driver.insertMany(drivers);
    console.log('Driver data seeded successfully');
  } catch (err) {
    console.error('Error seeding driver data:', err);
  }
};
seedDrivers();

io.on('connection', (socket) => {
  console.log('Client connected for real-time tracking');
  socket.on('locationUpdate', (data) => {
    socket.broadcast.emit('locationUpdate', data);
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`Delivery Service running on port ${PORT}`));

const processPendingDeliveries = async () => {
  const pendingDeliveries = await PendingDelivery.find();
  for (const pending of pendingDeliveries) {
    const nearestDriver = await Driver.findOne({ driverAvailability: true });
    if (nearestDriver) {
      const delivery = new Delivery({
        orderId: pending.orderId,
        customerId: pending.customerId,
        driverId: nearestDriver.driverId,
        status: 'assigned',
        currentLocation: pending.orderLocation,
      });
      await delivery.save();
      nearestDriver.driverAvailability = false;
      await nearestDriver.save();
      await PendingDelivery.findByIdAndDelete(pending._id);
      console.log(`Assigned pending delivery ${pending.orderId} to driver ${nearestDriver.driverId}`);
    }
  }
};

// Run the job every minute
setInterval(processPendingDeliveries, 60000);
