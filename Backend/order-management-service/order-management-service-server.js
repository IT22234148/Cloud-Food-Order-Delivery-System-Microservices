// order-management-service/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const connectDB = require('./config/db');
const orderRoutes = require('./routes/order.routes');

const app = express();
const PORT = process.env.PORT || 5002; // Use a different port for this service

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Order Management Service running on port ${PORT}`);
});