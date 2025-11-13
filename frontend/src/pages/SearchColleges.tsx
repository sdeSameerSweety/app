import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  type: string;
  ranking: number;
  description: string;
  _count: {
    reviews: number;
    courses: number;
  };
}

interface FilterOptions {
  states: string[];
  types: string[];
}

const SearchColleges: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ states: [], types: [] });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minRanking, setMinRanking] = useState('');
  const [maxRanking, setMaxRanking] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    searchColleges();
  }, [searchQuery, selectedState, selectedType, minRanking, maxRanking, page]);

  const fetchFilters = async () => {
    try {
      const response = await api.get('/search/filters');
      setFilters(response.data);
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  };

  const searchColleges = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 12 };
      if (searchQuery) params.query = searchQuery;
      if (selectedState) params.state = selectedState;
      if (selectedType) params.type = selectedType;
      if (minRanking) params.minRanking = minRanking;
      if (maxRanking) params.maxRanking = maxRanking;

      const response = await api.get('/search/colleges', { params });
      setColleges(response.data.colleges);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedType('');
    setMinRanking('');
    setMaxRanking('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Colleges</h1>
          <p className="mt-2 text-gray-600">
            Find the perfect college from our database of top institutions
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search colleges by name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={searchColleges}
              className="btn-primary flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All States</option>
                {filters.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {filters.types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Ranking
              </label>
              <input
                type="number"
                placeholder="e.g., 1"
                value={minRanking}
                onChange={(e) => setMinRanking(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Ranking
              </label>
              <input
                type="number"
                placeholder="e.g., 50"
                value={maxRanking}
                onChange={(e) => setMaxRanking(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {(selectedState || selectedType || minRanking || maxRanking || searchQuery) && (
            <div className="mt-4">
              <button
                onClick={resetFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Searching colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No colleges found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {colleges.length} colleges
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <Link
                  key={college.id}
                  to={`/colleges/${college.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {college.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {college.city}, {college.state}
                      </div>
                    </div>
                    {college.ranking && (
                      <div className="flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        #{college.ranking}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {college.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {college.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{college._count.courses} Courses</span>
                    <span>{college._count.reviews} Reviews</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchColleges;
