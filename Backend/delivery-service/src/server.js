import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import deliveryRoutes from './routes/deliveryRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/delivery', deliveryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));
