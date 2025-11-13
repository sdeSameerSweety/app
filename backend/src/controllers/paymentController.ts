import { Request, Response } from 'express';
import prisma from '../config/database';
import {
  createOrder,
  verifyPayment,
  getSubscriptionPrice,
  getSubscriptionDuration,
} from '../services/paymentService';

export const createPaymentOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { subscriptionTier } = req.body;

    if (!subscriptionTier) {
      res.status(400).json({ error: 'Subscription tier is required' });
      return;
    }

    const validTiers = [
      'STUDENT_PREMIUM',
      'PROFESSIONAL_PREMIUM',
      'ENTERPRISE_PREMIUM',
    ];

    if (!validTiers.includes(subscriptionTier)) {
      res.status(400).json({ error: 'Invalid subscription tier' });
      return;
    }

    const amount = getSubscriptionPrice(subscriptionTier);

    if (amount === 0) {
      res.status(400).json({ error: 'Invalid subscription tier price' });
      return;
    }

    const receipt = `sub_${req.user.id}_${Date.now()}`;

    const order = await createOrder({
      amount,
      currency: 'INR',
      receipt,
      notes: {
        userId: req.user.id,
        subscriptionTier,
        email: req.user.email,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error('Create payment order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment order' });
  }
};

export const verifyPaymentAndActivate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionTier } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: 'Payment details are incomplete' });
      return;
    }

    const isValid = verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      res.status(400).json({ error: 'Invalid payment signature' });
      return;
    }

    const amount = getSubscriptionPrice(subscriptionTier);
    const duration = getSubscriptionDuration(subscriptionTier);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    // Create subscription history record
    await prisma.subscriptionHistory.create({
      data: {
        userId: req.user.id,
        tier: subscriptionTier,
        amount: amount / 100, // Convert from paise to rupees
        startDate,
        endDate,
        paymentId: razorpay_payment_id,
        status: 'ACTIVE',
      },
    });

    // Update user subscription tier
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        subscriptionTier,
      },
    });

    res.json({
      message: 'Payment verified and subscription activated',
      subscription: {
        tier: subscriptionTier,
        startDate,
        endDate,
        paymentId: razorpay_payment_id,
      },
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        subscriptionTier: updatedUser.subscriptionTier,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const getSubscriptionHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const subscriptions = await prisma.subscriptionHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscription history error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription history' });
  }
};

export const getSubscriptionPlans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plans = [
      {
        tier: 'STUDENT_PREMIUM',
        name: 'Student Premium',
        price: 3999,
        duration: '1 year',
        features: [
          'Unlimited AI queries',
          'Unlimited voice conversations',
          'Priority review placement',
          'Advanced filters',
          'Email support (24h)',
          'Face verification',
        ],
        targetAudience: 'College Students',
      },
      {
        tier: 'PROFESSIONAL_PREMIUM',
        name: 'Professional Premium',
        price: 7999,
        duration: '1 year',
        features: [
          'All Student Premium features',
          'Career transition guidance',
          'Exclusive professional circles',
          'Mentorship matching',
          'Job board access',
          'Detailed career analytics',
        ],
        targetAudience: 'Working Professionals',
      },
      {
        tier: 'ENTERPRISE_PREMIUM',
        name: 'Enterprise Premium',
        price: 24999,
        duration: '1 year',
        features: [
          'All Professional Premium features',
          'Team management (up to 10 members)',
          'CSR program access',
          'Training program discounts',
          'Dedicated account manager',
          'Custom analytics dashboard',
        ],
        targetAudience: 'Entrepreneurs & Teams',
      },
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
};

export const cancelSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { subscriptionId } = req.params;

    const subscription = await prisma.subscriptionHistory.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    if (subscription.userId !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized to cancel this subscription' });
      return;
    }

    await prisma.subscriptionHistory.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED' },
    });

    // Check if user has any active subscriptions left
    const activeSubscriptions = await prisma.subscriptionHistory.findMany({
      where: {
        userId: req.user.id,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
    });

    if (activeSubscriptions.length === 0) {
      // Downgrade to free tier
      await prisma.user.update({
        where: { id: req.user.id },
        data: { subscriptionTier: 'FREE' },
      });
    }

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};
