// src/components/admindash/SubscriptionsManagement.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import dayjs from 'dayjs';
import { FaPlus, FaSearch, FaFilter, FaChartLine, FaUsers, FaClock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import SubscriptionCard from './commons/SubscriptionCard';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  job?: string;
  email?: string;
  city?: string;
}

interface Subscription {
  _id: string;
  user: User;
  startDate: string;
  endDate: string;
}

export default function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userPhone, setUserPhone] = useState('');
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscriptions');
      if (!Array.isArray(res.data)) throw new Error('Expected an array');
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingDays = (endDate: string) => {
    const today = dayjs();
    const end = dayjs(endDate);
    const diff = end.diff(today, 'day');
    return diff;
  };

  const getSubscriptionStatus = (endDate: string) => {
    const remainingDays = calculateRemainingDays(endDate);
    if (remainingDays < 0) return 'expired';
    if (remainingDays <= 7) return 'expiring';
    return 'active';
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userRes = await api.get(`/users/by-phone/${userPhone}`);
      const user = userRes.data;
      
      if (!user) {
        throw new Error('User not found with this phone number');
      }
      
      if (!user._id) {
        throw new Error('User data is invalid - missing ID');
      }

      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(user._id)) {
        throw new Error('Invalid user ID format');
      }

      const startDate = new Date().toISOString();
      const endDate = dayjs().add(duration, 'day').toISOString();

      await api.post('/subscriptions', { 
        userId: user._id,
        startDate, 
        endDate 
      });

      setSuccess('✅ Subscription added successfully!');
      setUserPhone('');
      setDuration(30);
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error adding subscription:', err);
      
      let errorMessage = '❌ Failed to add subscription';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error - please check if the user exists and try again';
      }
      
      setError(errorMessage);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const fullName = `${sub.user.firstName} ${sub.user.lastName}`.toLowerCase();
    const phone = sub.user.phone?.toLowerCase() || '';
    const job = sub.user.job?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = fullName.includes(searchLower) || 
                         phone.includes(searchLower) || 
                         job.includes(searchLower);
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && getSubscriptionStatus(sub.endDate) === statusFilter;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(sub => getSubscriptionStatus(sub.endDate) === 'active').length,
    expiring: subscriptions.filter(sub => getSubscriptionStatus(sub.endDate) === 'expiring').length,
    expired: subscriptions.filter(sub => getSubscriptionStatus(sub.endDate) === 'expired').length,
  };

  const handleEditSubscription = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit subscription:', id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Subscriptions</h3>
                <p className="text-gray-500">Please wait while we fetch the data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📅 Subscriptions Management
          </h1>
          <p className="text-gray-600 text-lg">Manage and monitor all user subscriptions</p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Subscriptions</p>
                <p className="text-3xl font-bold text-blue-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-800">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaChartLine className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">Expiring Soon</p>
                <p className="text-3xl font-bold text-amber-800">{stats.expiring}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-800">{stats.expired}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FaClock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add New Subscription Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaPlus className="w-6 h-6 text-blue-600" />
            Add New Subscription
          </h2>
          
          <form onSubmit={handleAddSubscription} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  📱 User Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +2126..."
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  ⏰ Duration (days)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                  min={1}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Subscription
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-600 font-medium">{success}</p>
              </div>
            )}
          </form>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone, or job..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions Grid */}
        {filteredSubscriptions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-gray-200/50">
            <div className="text-gray-400 text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No subscriptions found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                onEdit={handleEditSubscription}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
