const express = require('express');
const router = express.Router();
const {
  initiateCardPayment,
  initiateCOD,
  confirmCardPayment,
} = require('../controllers/paymentController');

router.post('/card', initiateCardPayment);
router.post('/cod', initiateCOD);
router.post('/confirm', confirmCardPayment);

module.exports = router;
