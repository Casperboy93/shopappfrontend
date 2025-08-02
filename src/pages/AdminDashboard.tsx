import { useEffect, useState } from 'react';
import api from '../lib/axios';

import PendingRegistrationRequests from '../components/admindash/PendingRegistrationRequests';
import SupportMessages from '../components/admindash/SupportMessages';
import ServicesManagement from '../components/admindash/ServicesManagement';
import NewUserForm from '../components/admindash/NewUserForm';
import SubscriptionsManagement from '../components/admindash/SubscriptionsManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [counts, setCounts] = useState({
    pending: 0,
    support: 0,
  });

  const fetchCounts = async () => {
    try {
      // Remove notification counts fetching
      // For now, we'll set static counts or fetch from other endpoints
      setCounts({
        pending: 0, // You can implement a separate endpoint for pending requests count
        support: 0, // You can implement a separate endpoint for support messages count
      });
    } catch (err) {
      console.error('Failed to fetch counts:', err);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(() => {
      fetchCounts();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-6">
      {/* Vertical Navigation Sidebar */}
      <nav className="w-64 bg-white shadow-lg rounded-xl p-4 h-fit">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>
        
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === 'pending' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>Pending Requests</span>
            <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === 'support' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>Support Messages</span>
            <span className="bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {counts.support}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`w-full px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === 'subscriptions' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Subscriptions
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === 'services' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Services Management
          </button>

          <button
            onClick={() => setActiveTab('newuser')}
            className={`w-full px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === 'newuser' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👥 Users Management
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'pending' && <PendingRegistrationRequests />}
        {activeTab === 'support' && <SupportMessages />}
        {activeTab === 'subscriptions' && <SubscriptionsManagement />}
        {activeTab === 'services' && <ServicesManagement />}
        {activeTab === 'newuser' && <NewUserForm />}
      </div>
    </div>
  );
}
