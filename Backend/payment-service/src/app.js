const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Ensure dotenv is loaded
const app = express();
app.use(cors());
app.use(express.json());

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected (Payment Service)'))
  .catch(err => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Payment Service running on port ${process.env.PORT}`);
});
