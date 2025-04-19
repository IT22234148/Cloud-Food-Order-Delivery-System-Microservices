import express from 'express';
import {
  assignDelivery,
  updateDelivery,
  getStatus,
  getDriverDeliveries
} from '../controllers/deliveryController.js';

import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/assign', verifyToken, assignDelivery);
router.put('/update/:orderId', verifyToken, checkRole('driver'), updateDelivery);
router.get('/status/:orderId', verifyToken, getStatus);
router.get('/assigned/:driverId', verifyToken, checkRole('driver'), getDriverDeliveries);

export default router;
