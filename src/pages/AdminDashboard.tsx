// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

import PendingRegistrationRequests from '../components/admindash/PendingRegistrationRequests';
import Notifications from '../components/admindash/Notifications';
import SupportMessages from '../components/admindash/SupportMessages';
import ServicesManagement from '../components/admindash/ServicesManagement';
import NewUserForm from '../components/admindash/NewUserForm';
import SubscriptionsManagement from '../components/admindash/SubscriptionsManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [counts, setCounts] = useState({
    pending: 0,
    notifications: 0,
    support: 0,
  });

  const fetchCounts = async () => {
    try {
      const notifRes = await axios.get('http://localhost:3000/notifications/counts');
      const notifCounts = notifRes.data as Record<string, number>; // 👈 Fix: type assertion

      setCounts({
        pending: notifCounts['REGISTRATION'] ?? 0,
        support: notifCounts['SUPPORT'] ?? 0,
        notifications: Object.values(notifCounts).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0),
      });
    } catch (err) {
      console.error('Failed to fetch notification counts:', err);
    }
  };



  useEffect(() => {
    fetchCounts(); // fetch initially

    const interval = setInterval(() => {
      fetchCounts();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <nav className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Pending Requests
          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Notifications
          <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {counts.notifications}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${activeTab === 'support' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Support Messages
          <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {counts.support}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 rounded-full text-sm ${activeTab === 'subscriptions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Subscriptions
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-full text-sm ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          Services Management
        </button>

        <button
          onClick={() => setActiveTab('newuser')}
          className={`px-4 py-2 rounded-full text-sm ${activeTab === 'newuser' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
        >
          ➕ Add New User
        </button>
      </nav>

      {/* Active Section */}
      <div>
        {activeTab === 'pending' && <PendingRegistrationRequests />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'support' && <SupportMessages />}
        {activeTab === 'subscriptions' && <SubscriptionsManagement />}
        {activeTab === 'services' && <ServicesManagement />}
        {activeTab === 'newuser' && <NewUserForm />}

      </div>
    </div>
  );
}
