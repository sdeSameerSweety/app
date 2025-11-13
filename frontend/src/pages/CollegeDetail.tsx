import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Globe, Calendar, Star, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';

interface CollegeData {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  type: string;
  ranking: number;
  website: string;
  description: string;
  establishedYear: number;
  accreditation: string[];
  averageRating: number;
  courses: any[];
  reviews: any[];
  _count: {
    courses: number;
    reviews: number;
  };
}

const CollegeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  const fetchCollegeDetails = async () => {
    try {
      const response = await api.get(`/search/colleges/${id}`);
      setCollege(response.data.college);
    } catch (error) {
      console.error('Failed to fetch college details:', error);
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
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-gray-700 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">College not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {college.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-1" />
                  {college.location}
                </div>

                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <Globe className="w-5 h-5 mr-1" />
                    Official Website
                  </a>
                )}

                {college.establishedYear && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1" />
                    Est. {college.establishedYear}
                  </div>
                )}
              </div>
            </div>

            {college.ranking && (
              <div className="bg-primary-100 text-primary-800 px-6 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  <div>
                    <div className="text-sm">Ranking</div>
                    <div className="text-2xl font-bold">#{college.ranking}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {college.averageRating.toFixed(1)}
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Courses</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {college._count.courses}
                  </div>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Reviews</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {college._count.reviews}
                  </div>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="text-lg font-bold text-gray-900">
                    {college.type}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{college.description}</p>
            </div>

            {/* Courses */}
            {college.courses.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Top Courses
                </h2>
                <div className="space-y-4">
                  {college.courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {course.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {course.duration && <span>{course.duration}</span>}
                        {course.fees && <span>{course.fees}</span>}
                        {course.rating && (
                          <span className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            {course.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {college.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Recent Reviews
                </h2>
                <div className="space-y-6">
                  {college.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {review.title}
                          </h4>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3">{review.content}</p>

                      <div className="text-sm text-gray-600">
                        by {review.user.name}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/reviews?collegeId=${college.id}`}
                  className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all reviews →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Accreditation */}
            {college.accreditation.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Accreditation</h3>
                <div className="flex flex-wrap gap-2">
                  {college.accreditation.map((acc, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/write-review?collegeId=${college.id}`}
                  className="block w-full btn-primary text-center"
                >
                  Write a Review
                </Link>
                <button className="block w-full btn-secondary text-center">
                  Compare Colleges
                </button>
                <button className="block w-full btn-secondary text-center">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetail;
