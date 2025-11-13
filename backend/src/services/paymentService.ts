import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env';

// Initialize Razorpay
const razorpay = config.razorpay?.keyId && config.razorpay?.keySecret
  ? new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    })
  : null;

export interface CreateOrderParams {
  amount: number; // in paise (₹1 = 100 paise)
  currency: string;
  receipt: string;
  notes?: any;
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createOrder = async (params: CreateOrderParams) => {
  if (!razorpay) {
    throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
  }

  try {
    const order = await razorpay.orders.create({
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes || {},
    });

    return order;
  } catch (error) {
    console.error('Razorpay create order error:', error);
    throw new Error('Failed to create payment order');
  }
};

export const verifyPayment = (params: VerifyPaymentParams): boolean => {
  if (!config.razorpay?.keySecret) {
    throw new Error('Razorpay key secret not configured');
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

export const getSubscriptionPrice = (tier: string): number => {
  const prices: { [key: string]: number } = {
    STUDENT_PREMIUM: 399900, // ₹3,999 in paise
    PROFESSIONAL_PREMIUM: 799900, // ₹7,999 in paise
    ENTERPRISE_PREMIUM: 2499900, // ₹24,999 in paise
  };

  return prices[tier] || 0;
};

export const getSubscriptionDuration = (tier: string): number => {
  // Returns duration in days
  return 365; // 1 year for all tiers
};
