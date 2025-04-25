import express from 'express';
import { assignDelivery, updateDelivery, getDelivery, getDeliveriesByDriver } from '../controllers/deliveryController.js';
import authMiddleware from '../middlewares/auth.js'; // Corrected import path

const router = express.Router();

router.post('/assign', authMiddleware, assignDelivery);
router.put('/:id', authMiddleware, updateDelivery);
router.get('/:id', authMiddleware, getDelivery);
router.get('/driver/:driverId', authMiddleware, getDeliveriesByDriver);

export default router;
