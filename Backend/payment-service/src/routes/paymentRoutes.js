const express = require('express');
const router = express.Router();
const {
  initiateCardPayment,
  initiateCOD,
  confirmCardPayment,
  getAllPayments,
  updatePaymentStatus,
  deletePayment
} = require('../controllers/paymentController');
const protect = require('../middlewares/authMiddleware');

// router.delete('/delete/:id', protect, authorizeRoles('admin'), deletePayment);
// const { deletePayment } = require('../controllers/paymentController');

// router.delete('/delete/:id', protect, authorizeRoles('admin'), deletePayment);



router.post('/card', protect, initiateCardPayment);
router.post('/cod', protect, initiateCOD);
router.post('/confirm', protect, confirmCardPayment);
router.get('/list', protect, getAllPayments);
router.patch('/update/:id', protect, updatePaymentStatus);
router.delete('/delete/:id', protect, deletePayment);

module.exports = router;
