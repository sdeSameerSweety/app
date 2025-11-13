import express from 'express';
import {
  createPaymentOrder,
  verifyPaymentAndActivate,
  getSubscriptionHistory,
  getSubscriptionPlans,
  cancelSubscription,
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/plans', getSubscriptionPlans);
router.post('/create-order', authenticateToken, createPaymentOrder);
router.post('/verify', authenticateToken, verifyPaymentAndActivate);
router.get('/history', authenticateToken, getSubscriptionHistory);
router.delete('/cancel/:subscriptionId', authenticateToken, cancelSubscription);

export default router;
