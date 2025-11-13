import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Check, Zap, Crown, Building } from 'lucide-react';

interface Plan {
  tier: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  targetAudience: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscriptionPlans: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/payment/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcessingTier(tier);
    setLoading(true);

    try {
      // Step 1: Create order
      const orderResponse = await api.post('/payment/create-order', {
        subscriptionTier: tier,
      });

      const { orderId, amount, currency } = orderResponse.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: '2minreview',
        description: `${tier.replace('_', ' ')} Subscription`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Step 3: Verify payment
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionTier: tier,
            });

            // Success!
            alert('Subscription activated successfully!');
            navigate('/dashboard');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setProcessingTier(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      alert(error.response?.data?.error || 'Failed to initiate payment');
      setLoading(false);
      setProcessingTier(null);
    }
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'STUDENT_PREMIUM':
        return <Zap className="w-8 h-8" />;
      case 'PROFESSIONAL_PREMIUM':
        return <Crown className="w-8 h-8" />;
      case 'ENTERPRISE_PREMIUM':
        return <Building className="w-8 h-8" />;
      default:
        return <Check className="w-8 h-8" />;
    }
  };

  const isCurrentPlan = (tier: string) => {
    return user?.subscriptionTier === tier;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock premium features and accelerate your career growth
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 ${
                plan.tier === 'PROFESSIONAL_PREMIUM'
                  ? 'ring-4 ring-primary-500'
                  : ''
              }`}
            >
              {plan.tier === 'PROFESSIONAL_PREMIUM' && (
                <div className="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                    plan.tier === 'STUDENT_PREMIUM'
                      ? 'bg-blue-100 text-blue-600'
                      : plan.tier === 'PROFESSIONAL_PREMIUM'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {getPlanIcon(plan.tier)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Target Audience */}
                <p className="text-gray-600 mb-6">{plan.targetAudience}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>

                {/* Subscribe Button */}
                {isCurrentPlan(plan.tier) ? (
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-lg bg-gray-200 text-gray-500 font-semibold cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.tier)}
                    disabled={loading && processingTier === plan.tier}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.tier === 'PROFESSIONAL_PREMIUM'
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading && processingTier === plan.tier
                      ? 'Processing...'
                      : 'Subscribe Now'}
                  </button>
                )}

                {/* Features */}
                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time from your dashboard.
                You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit/debit cards, UPI, net banking, and digital
                wallets through Razorpay.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Yes, all payments are processed through Razorpay, which is PCI DSS
                compliant. We never store your card information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I upgrade my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade to a higher tier at any time. You'll be charged the
                prorated difference.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex items-center justify-center gap-8 text-gray-600">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Cancel Anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>No Hidden Fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
