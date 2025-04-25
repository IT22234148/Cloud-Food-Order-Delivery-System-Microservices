// Backend/order-management-service/src/app.js
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
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.send('Order Management Service is running');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Order Management Service running on port ${PORT}`));