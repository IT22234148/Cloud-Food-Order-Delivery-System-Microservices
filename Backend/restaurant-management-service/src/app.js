// Backend/restaurant-management-service/src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.send('Restaurant Management Service is running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Restaurant Management Service running on port ${PORT}`));