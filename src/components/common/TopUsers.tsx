import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from '../user/UserCard';
import api from '../../lib/axios';
import { FaSearch, FaFilter, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import type { User } from '../../types/user';

type SortOption = 'rating' | 'views' | 'phoneViews' | 'newest';
type FilterOption = 'all' | 'top-rated' | 'most-viewed' | 'recent';

export default function TopUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showCount, setShowCount] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/all-subs');
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load professionals. Please try again later.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.job.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    // Apply filters
    switch (filterBy) {
      case 'top-rated':
        filtered = filtered.filter(user => user.rating >= 4.5);
        break;
      case 'most-viewed':
        filtered = filtered.filter(user => user.views >= 100);
        break;
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(user => 
          user.createdAt && new Date(user.createdAt) >= thirtyDaysAgo
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [users, searchTerm, filterBy]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        case 'phoneViews':
          return b.phoneViews - a.phoneViews;
        case 'newest':
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        default:
          return b.rating - a.rating;
      }
    });
  }, [filteredUsers, sortBy]);

  const displayedUsers = sortedUsers.slice(0, showCount);

  const handleViewAll = () => {
    navigate('/advanced-search');
  };

  const handleLoadMore = () => {
    setShowCount(prev => prev + 8);
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-custom-500/5"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
          <FaSpinner className="animate-spin text-golden-500 text-4xl mb-4" />
          <p className="text-gray-300 text-lg">Loading top professionals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-custom-500/5"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
          <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="btn-golden-enhanced px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-custom-500/5"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className=" bg-clip-text text-emerald-600">Our Top</span>{' '}
            <span className="text-white">Professionals</span>
          </h2>
          <p className="text-gray-400 text-lg mb-6">Discover skilled professionals in your area</p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-golden-400">{users.length}</div>
              <div className="text-sm text-gray-400">Total Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {users.filter(u => u.rating >= 4.5).length}
              </div>
              <div className="text-sm text-gray-400">Top Rated (4.5+)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {new Set(users.map(u => u.city)).size}
              </div>
              <div className="text-sm text-gray-400">Cities Covered</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8 px-4">
          {/* Search Bar */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search professionals by name, city, or job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-golden-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-golden-500 transition-colors backdrop-blur"
            />
          </div>

          {/* Filter Toggle */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800/50 border border-golden-600/30 rounded-lg text-white hover:border-golden-500 transition-colors backdrop-blur"
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full bg-dark-800/50 border border-golden-600/30 rounded-lg px-4 py-2 text-white focus:border-golden-500 focus:outline-none transition-colors backdrop-blur"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="views">Most Views</option>
                  <option value="phoneViews">Most Phone Views</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Filter Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter By</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="w-full bg-dark-800/50 border border-golden-600/30 rounded-lg px-4 py-2 text-white focus:border-golden-500 focus:outline-none transition-colors backdrop-blur"
                >
                  <option value="all">All Professionals</option>
                  <option value="top-rated">Top Rated (4.5+)</option>
                  <option value="most-viewed">Most Viewed (100+)</option>
                  <option value="recent">Recent (Last 30 days)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="text-center mb-8">
          <p className="text-gray-400">
            Showing {displayedUsers.length} of {sortedUsers.length} professionals
            {(searchTerm || filterBy !== 'all') && (
              <span className="text-golden-400"> (filtered)</span>
            )}
          </p>
        </div>

        {/* Users Grid */}
        {displayedUsers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm || filterBy !== 'all' ? 'No professionals match your criteria' : 'No professionals found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Check back later for new professionals'
              }
            </p>
            {(searchTerm || filterBy !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                }}
                className="btn-golden-enhanced px-6 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 mb-8">
              {displayedUsers.map((user) => (
                <UserCard key={user._id || user.id} user={user} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              {showCount < sortedUsers.length && (
                <button
                  onClick={handleLoadMore}
                  className="bg-dark-800/50 border border-golden-600/30 text-white px-8 py-3 rounded-xl hover:border-golden-500 transition-all duration-200 backdrop-blur mr-4"
                >
                  Load More ({sortedUsers.length - showCount} remaining)
                </button>
              )}
              
              <button
                onClick={handleViewAll}
                className="btn-golden-enhanced px-8 py-3 rounded-xl font-semibold"
              >
                View All Professionals
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
