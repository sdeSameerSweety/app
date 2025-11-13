import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Review } from '../types';
import { Star, ThumbsUp, ThumbsDown, Shield } from 'lucide-react';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      setReviews(response.data.reviews);
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authentic Reviews</h1>
          <p className="mt-2 text-gray-600">
            Read verified reviews from students and professionals
          </p>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No reviews found. Be the first to write one!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{review.title}</h3>
                      {review.isVerified && (
                        <Shield className="w-5 h-5 text-green-600" title="Verified Review" />
                      )}
                    </div>
                    {renderStars(review.rating)}
                    <p className="text-sm text-gray-600 mt-2">
                      By {review.user.name} • {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {review.reviewType}
                  </span>
                </div>

                {review.college && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>{review.college.name}</strong> • {review.college.location}
                    </p>
                  </div>
                )}

                <p className="text-gray-800 mb-4">{review.content}</p>

                {review.pros && (
                  <div className="mb-3">
                    <strong className="text-green-700">Pros:</strong>
                    <p className="text-gray-700">{review.pros}</p>
                  </div>
                )}

                {review.cons && (
                  <div className="mb-3">
                    <strong className="text-red-700">Cons:</strong>
                    <p className="text-gray-700">{review.cons}</p>
                  </div>
                )}

                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-green-600">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{review.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                    <ThumbsDown className="w-5 h-5" />
                    <span>{review.downvotes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
