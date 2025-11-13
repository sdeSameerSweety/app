import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Subscription {
  id: string;
  tier: string;
  amount: number;
  startDate: string;
  endDate: string;
  paymentId: string;
  status: string;
  createdAt: string;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubscriptions();
  }, [user, navigate]);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/payment/history');
      setSubscriptions(response.data.subscriptions);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    setCancellingId(subscriptionId);
    try {
      await api.delete(`/payment/cancel/${subscriptionId}`);
      await fetchSubscriptions();
      alert('Subscription cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const getTierDisplayName = (tier: string) => {
    const names: { [key: string]: string } = {
      STUDENT_PREMIUM: 'Student Premium',
      PROFESSIONAL_PREMIUM: 'Professional Premium',
      ENTERPRISE_PREMIUM: 'Enterprise Premium',
      FREE: 'Free',
    };
    return names[tier] || tier;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'EXPIRED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5" />;
      case 'EXPIRED':
        return <Clock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isSubscriptionActive = (subscription: Subscription) => {
    return subscription.status === 'ACTIVE' && new Date(subscription.endDate) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="mt-2 text-gray-600">
            View and manage your subscription history
          </p>
        </div>

        {/* Current Tier */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Subscription Tier</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {getTierDisplayName(user?.subscriptionTier || 'FREE')}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {user?.subscriptionTier === 'FREE'
                  ? 'Upgrade to unlock premium features'
                  : 'Thank you for being a premium member!'}
              </p>
            </div>
            <button
              onClick={() => navigate('/plans')}
              className="btn-primary"
            >
              {user?.subscriptionTier === 'FREE' ? 'Upgrade Now' : 'View Plans'}
            </button>
          </div>
        </div>

        {/* Subscription History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Subscription History</h2>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No subscription history found</p>
              <button
                onClick={() => navigate('/plans')}
                className="btn-primary"
              >
                View Premium Plans
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getTierDisplayName(subscription.tier)}
                        </h3>
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            subscription.status
                          )}`}
                        >
                          {getStatusIcon(subscription.status)}
                          {subscription.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Start: {formatDate(subscription.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            End: {formatDate(subscription.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CreditCard className="w-4 h-4 mr-2" />
                          <span>Amount: ₹{subscription.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CreditCard className="w-4 h-4 mr-2" />
                          <span className="truncate" title={subscription.paymentId}>
                            Payment ID: {subscription.paymentId.substring(0, 20)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSubscriptionActive(subscription) && (
                      <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        disabled={cancellingId === subscription.id}
                        className="ml-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === subscription.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-blue-800">
            If you have any questions about your subscription or need assistance,
            please contact our support team at{' '}
            <a
              href="mailto:support@2minreview.com"
              className="underline font-medium"
            >
              support@2minreview.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
