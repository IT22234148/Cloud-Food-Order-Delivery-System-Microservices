// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuItemRoutes = require('./routes/menuitem.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuItemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
