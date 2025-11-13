import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Star, MessageSquare, TrendingUp, CreditCard, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="mt-2 text-gray-600">Here's your career transformation dashboard</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-primary-600">
              {user.subscriptionTier.replace('_', ' ')}
            </p>
            <p className="text-sm text-gray-600 mt-1">Active plan</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Credibility</h3>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{user.credibilityScore || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Score points</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Queries</h3>
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {user.aiQueriesUsed || 0}
              {user.subscriptionTier === 'FREE' && ' / 50'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {user.subscriptionTier === 'FREE' ? 'Queries used' : 'Unlimited'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Verification</h3>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{user.verificationLevel}</p>
            <p className="text-sm text-gray-600 mt-1">Current level</p>
          </div>
        </div>

        {user.subscriptionTier === 'FREE' && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-primary-100">
                  Unlock unlimited AI queries, priority support, and exclusive features
                </p>
              </div>
              <Link
                to="/plans"
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                View Plans
              </Link>
            </div>
          </div>
        )}

        {user.subscriptionTier !== 'FREE' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Member</h3>
                <p className="text-gray-600">
                  You are enjoying all the benefits of {user.subscriptionTier.replace('_', ' ')}
                </p>
              </div>
              <Link
                to="/subscriptions"
                className="btn-secondary flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Manage Subscription
              </Link>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Verified</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isEmailVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isEmailVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Phone Verified</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isPhoneVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.isPhoneVerified ? 'Yes' : 'Not Set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Face Verified</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isFaceVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.isFaceVerified ? 'Yes' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="font-medium text-primary-900">Write a Review</div>
                <div className="text-sm text-primary-700">Share your experience</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-900">Chat with AI</div>
                <div className="text-sm text-blue-700">Get career guidance</div>
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">Join Circles</div>
                <div className="text-sm text-green-700">Connect with peers</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
