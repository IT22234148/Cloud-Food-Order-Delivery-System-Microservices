const express = require('express');
const router = express.Router();
const {
  initiateCardPayment,
  initiateCOD,
  confirmCardPayment,
} = require('../controllers/paymentController');

const protect = require('../middlewares/authMiddleware');

router.post('/card', protect, initiateCardPayment);
router.post('/cod', protect, initiateCOD);
router.post('/confirm', protect, confirmCardPayment);

module.exports = router;
