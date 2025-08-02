// src/components/admindash/SubscriptionsManagement.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import dayjs from 'dayjs';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // First, find user by phone
      const userRes = await api.get(`/users/by-phone/${userPhone}`);
      const user = userRes.data;
      
      // Check if user exists and has valid _id
      if (!user) {
        throw new Error('User not found with this phone number');
      }
      
      if (!user._id) {
        throw new Error('User data is invalid - missing ID');
      }

      // Validate that _id is a valid ObjectId format (24 hex characters)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(user._id)) {
        throw new Error('Invalid user ID format');
      }

      const startDate = new Date().toISOString();
      const endDate = dayjs().add(duration, 'day').toISOString();

      // Send the subscription data
      await api.post('/subscriptions', { 
        userId: user._id,  // Send as string ObjectId
        startDate, 
        endDate 
      });

      setSuccess('✅ Subscription added successfully!');
      setUserPhone('');
      setDuration(30);
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error adding subscription:', err);
      
      // More detailed error handling
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

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📅 Subscriptions Management</h2>

      {/* Statistics Cards */}
      // Update the statistics cards section:
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <div className="bg-blue-50 p-3 lg:p-4 rounded-lg border border-blue-200">
          <h3 className="text-xs lg:text-sm font-medium text-blue-600">Total Subscriptions</h3>
          <p className="text-lg lg:text-2xl font-bold text-blue-800">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-3 lg:p-4 rounded-lg border border-green-200">
          <h3 className="text-xs lg:text-sm font-medium text-green-600">Active</h3>
          <p className="text-lg lg:text-2xl font-bold text-green-800">{stats.active}</p>
        </div>
        <div className="bg-yellow-50 p-3 lg:p-4 rounded-lg border border-yellow-200">
          <h3 className="text-xs lg:text-sm font-medium text-yellow-600">Expiring Soon</h3>
          <p className="text-lg lg:text-2xl font-bold text-yellow-800">{stats.expiring}</p>
        </div>
        <div className="bg-red-50 p-3 lg:p-4 rounded-lg border border-red-200">
          <h3 className="text-xs lg:text-sm font-medium text-red-600">Expired</h3>
          <p className="text-lg lg:text-2xl font-bold text-red-800">{stats.expired}</p>
        </div>
      </div>
      
      // Update the form section:
      <form onSubmit={handleAddSubscription} className="mb-6 lg:mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Subscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">User Phone</label>
            <input
              type="text"
              placeholder="e.g. +2126..."
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
              min={1}
              className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            ➕ Add Subscription
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-3 p-2 bg-red-50 rounded">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-3 p-2 bg-green-50 rounded">{success}</p>}
      </form>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, phone, or job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-600 text-lg">No subscriptions found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((sub) => {
            const remainingDays = calculateRemainingDays(sub.endDate);
            const status = getSubscriptionStatus(sub.endDate);
            const fullName = `${sub.user.firstName} ${sub.user.lastName}`;
            
            return (
              <div key={sub._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{fullName}</h3>
                    <p className="text-sm text-gray-600">{sub.user.job || 'No job specified'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-16">📱 Phone:</span>
                    <span className="text-gray-800 font-medium">{sub.user.phone}</span>
                  </div>
                  {sub.user.email && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-16">✉️ Email:</span>
                      <span className="text-gray-800 truncate">{sub.user.email}</span>
                    </div>
                  )}
                  {sub.user.city && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-16">📍 City:</span>
                      <span className="text-gray-800">{sub.user.city}</span>
                    </div>
                  )}
                </div>

                {/* Subscription Details */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Start Date</span>
                      <span className="text-gray-800 font-medium">{dayjs(sub.startDate).format('DD/MM/YYYY')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">End Date</span>
                      <span className="text-gray-800 font-medium">{dayjs(sub.endDate).format('DD/MM/YYYY')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <div className={`text-lg font-bold ${
                      remainingDays < 0 ? 'text-red-600' : 
                      remainingDays <= 7 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {remainingDays < 0 ? 
                        `Expired ${Math.abs(remainingDays)} days ago` :
                        `${remainingDays} days remaining`
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
