import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import notifyRoutes from './routes/notifyRoutes.js';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
if (!process.env.PORT) {
  console.error('❌ PORT is not defined in the .env file');
  process.exit(1);
}

console.log(`Loaded PORT: ${process.env.PORT}`);

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
}));

app.use('/notify', notifyRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`✅ Notification service running on port ${PORT}`);
});