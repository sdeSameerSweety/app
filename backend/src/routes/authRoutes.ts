import express from 'express';
import {
  register,
  login,
  verifyEmailOTP,
  resendOTP,
  getProfile,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyEmailOTP);
router.post('/resend-otp', resendOTP);
router.get('/profile', authenticateToken, getProfile);

export default router;
