import express from 'express';
import dotenv from 'dotenv';
import notifyRoutes from './routes/notifyRoutes.js';

dotenv.config({ path: './.env' });
console.log(`Loaded PORT: ${process.env.PORT}`);

const app = express();
app.use(express.json());

app.use('/notify', notifyRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`✅ Notification service running on port ${PORT}`);
});