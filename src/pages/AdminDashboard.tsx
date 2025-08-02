import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { 
  FaBars, 
  FaTimes, 
  FaClock, 
  FaHeadset, 
  FaCrown, 
  FaCogs, 
  FaUsers,
  FaChartLine,
  FaSync
} from 'react-icons/fa';

import PendingRegistrationRequests from '../components/admindash/PendingRegistrationRequests';
import SupportMessages from '../components/admindash/SupportMessages';
import ServicesManagement from '../components/admindash/ServicesManagement';
import NewUserForm from '../components/admindash/NewUserForm';
import SubscriptionsManagement from '../components/admindash/SubscriptionsManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({
    pending: 0,
    support: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch pending registration requests
      const pendingResponse = await api.get('/registration-requests');
      const pendingRequests = pendingResponse.data.filter(
        (request: any) => request.status === 'pending'
      );
      
      // Fetch support messages
      const supportResponse = await api.get('/support');
      const supportMessages = supportResponse.data;
      
      setCounts({
        pending: pendingRequests.length,
        support: supportMessages.length,
      });
    } catch (err) {
      console.error('Failed to fetch counts:', err);
      setCounts({
        pending: 0,
        support: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(() => {
      fetchCounts();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { 
      id: 'pending', 
      label: 'Pending Requests', 
      icon: FaClock,
      count: counts.pending, 
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'from-orange-600 to-red-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      countBg: 'bg-orange-500',
      description: 'Registration requests awaiting approval'
    },
    { 
      id: 'support', 
      label: 'Support Messages', 
      icon: FaHeadset,
      count: counts.support, 
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-600 to-pink-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      countBg: 'bg-purple-500',
      description: 'Customer support inquiries'
    },
    { 
      id: 'subscriptions', 
      label: 'Subscriptions', 
      icon: FaCrown,
      gradient: 'from-yellow-500 to-amber-500',
      hoverGradient: 'from-yellow-600 to-amber-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      countBg: 'bg-yellow-500',
      description: 'Manage user subscriptions'
    },
    { 
      id: 'services', 
      label: 'Services Management', 
      icon: FaCogs,
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      countBg: 'bg-emerald-500',
      description: 'Manage available services'
    },
    { 
      id: 'newuser', 
      label: 'Users Management', 
      icon: FaUsers,
      gradient: 'from-blue-500 to-indigo-500',
      hoverGradient: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      countBg: 'bg-blue-500',
      description: 'Manage system users'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <FaChartLine className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xs text-gray-500">Management Portal</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Redesigned */}
        <nav className={`
          fixed lg:static inset-y-0 left-0 z-30 w-80 transform transition-all duration-300 ease-in-out
          lg:transform-none lg:m-6 lg:h-fit
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className="relative z-50 h-full lg:h-auto">
            {/* Sidebar Background with Glassmorphism */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl lg:rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/30 to-purple-50/40 lg:rounded-2xl"></div>
            
            <div className="relative p-6 lg:p-8 h-full">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                      <FaChartLine className="text-white" size={24} />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Management Portal</p>
                  
                  {loading && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 rounded-full">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span className="text-xs text-blue-700 font-medium">Updating...</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden absolute top-6 right-6 p-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-xl transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              {/* Navigation Items */}
              <div className="space-y-4 mt-8 lg:mt-0">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      className="relative group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                          isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl scale-[1.02]`
                            : 'bg-white/60 hover:bg-white/80 text-gray-700 shadow-lg hover:shadow-xl border border-white/40'
                        }`}
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                        </div>
                        
                        <div className="relative flex items-center gap-4 p-5">
                          {/* Icon Container */}
                          <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                            isActive 
                              ? 'bg-white/20 backdrop-blur-sm' 
                              : `${item.iconBg} group-hover:scale-110`
                          }`}>
                            <IconComponent 
                              size={22} 
                              className={isActive ? 'text-white' : item.iconColor}
                            />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 text-left">
                            <div className="font-bold text-base mb-1">
                              {item.label}
                            </div>
                            <div className={`text-xs leading-relaxed ${
                              isActive ? 'text-white/90' : 'text-gray-500'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                          
                          {/* Count Badge */}
                          {item.count !== undefined && (
                            <div className={`flex-shrink-0 min-w-[32px] h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                              isActive
                                ? 'bg-white/20 text-white backdrop-blur-sm'
                                : `${item.countBg} text-white shadow-lg`
                            }`}>
                              {loading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                <span className="relative z-10">{item.count}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Hover Effect */}
                        {!isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${item.hoverGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                        )}
                        
                        {/* Active Glow */}
                        {isActive && (
                          <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-30 -z-10`}></div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {/* Refresh Section */}
              <div className="mt-8 pt-6 border-t border-white/30">
                <button
                  onClick={fetchCounts}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-gray-100/80 to-gray-200/80 hover:from-gray-200/80 hover:to-gray-300/80 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl border border-white/40 group"
                >
                  <div className={`p-2 bg-white/60 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                    loading ? 'animate-spin' : ''
                  }`}>
                    <FaSync size={14} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {loading ? 'Refreshing...' : 'Refresh Counts'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-6 lg:pl-0">
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
            {activeTab === 'pending' && <PendingRegistrationRequests />}
            {activeTab === 'support' && <SupportMessages />}
            {activeTab === 'subscriptions' && <SubscriptionsManagement />}
            {activeTab === 'services' && <ServicesManagement />}
            {activeTab === 'newuser' && <NewUserForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
