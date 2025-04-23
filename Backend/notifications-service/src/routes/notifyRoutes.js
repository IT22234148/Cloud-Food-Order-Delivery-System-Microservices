import express from 'express';
import {
  sendCustomerConfirmation,
  sendDriverAssignment
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/customer-confirmation', sendCustomerConfirmation);
router.post('/driver-assignment', sendDriverAssignment);

export default router;