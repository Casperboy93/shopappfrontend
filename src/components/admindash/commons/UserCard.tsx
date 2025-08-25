import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaEdit,
  FaEye,
  FaStar,
  FaCalendarAlt,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import api from '../../../lib/axios';
import { MOROCCAN_CITIES } from '../../../consts/cities';
import { JOB_TYPES } from '../../../consts/jobs';

// CSS for LTR phone number display
const phoneStyle = {
  direction: 'ltr' as const,
  textAlign: 'left' as const,
  unicodeBidi: 'embed' as const
};

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  job?: string;
  role: string;
  status: string;
  views: number;
  phoneViews: number;
  rating: number;
  createdAt?: string;
}

interface Subscription {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    job?: string;
    email?: string;
    city?: string;
  };
  startDate: string;
  endDate: string;
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export default function UserCard({ user, onEdit }: UserCardProps) {
  const { t } = useTranslation();
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'expiring' | 'expired' | 'none'>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSubscription();
  }, [user._id]);

  const checkUserSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions');
      const subscriptions: Subscription[] = response.data;
      
      // Find subscription for this user
      const userSubscription = subscriptions.find(sub => sub.user._id === user._id);
      
      if (userSubscription) {
        const status = getSubscriptionStatus(userSubscription.endDate);
        setSubscriptionStatus(status);
      } else {
        setSubscriptionStatus('none');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus('none');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = (endDate: string): 'active' | 'expiring' | 'expired' => {
    const today = dayjs();
    const end = dayjs(endDate);
    const remainingDays = end.diff(today, 'day');
    
    if (remainingDays < 0) return 'expired';
    if (remainingDays <= 7) return 'expiring';
    return 'active';
  };

  const getSubscriptionBadgeConfig = () => {
    switch (subscriptionStatus) {
      case 'active':
        return {
          icon: FaCheckCircle,
          text: 'Subscribed',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-200'
        };
      case 'expiring':
        return {
          icon: FaClock,
          text: 'Expiring',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'expired':
        return {
          icon: FaTimesCircle,
          text: 'Expired',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: FaTimesCircle,
          text: 'No Subscription',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Helper function to get translated city name
  const getTranslatedCity = (cityValue: string) => {
    if (!cityValue) return cityValue;
    
    // Try to find the city key that matches the stored value
    const cityKey = MOROCCAN_CITIES.find(key => {
      const keyWithoutPrefix = key.replace('cities.', '');
      return keyWithoutPrefix.toLowerCase() === cityValue.toLowerCase() || 
             t(key).toLowerCase() === cityValue.toLowerCase();
    });
    
    return cityKey ? t(cityKey) : cityValue;
  };

  // Helper function to get translated job name
  const getTranslatedJob = (jobValue: string) => {
    if (!jobValue) return jobValue;
    
    // Try to find the job key that matches the stored value
    const jobKey = JOB_TYPES.find(key => {
      const keyWithoutPrefix = key.replace('jobs.', '');
      return keyWithoutPrefix.toLowerCase() === jobValue.toLowerCase() || 
             t(key).toLowerCase() === jobValue.toLowerCase();
    });
    
    return jobKey ? t(jobKey) : jobValue;
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'SUPERADMIN':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-30"></div>
      
      {/* Card Content */}
      <div className="relative p-4">
        {/* Header - Compact */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-800 text-lg leading-tight truncate">
              {user.firstName} {user.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyle(user.role)}`}>
                {user.role}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(user.status)}`}>
                {user.status}
              </span>
              {!loading && (() => {
                const badgeConfig = getSubscriptionBadgeConfig();
                const IconComponent = badgeConfig.icon;
                return (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeConfig.bgColor} ${badgeConfig.textColor} ${badgeConfig.borderColor}`}>
                    <IconComponent className="w-3 h-3" />
                    <span>{badgeConfig.text}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Contact Information - Organized */}
        <div className="space-y-3 mb-4">
          {user.email && (
            <div className="flex items-center text-gray-600 text-sm">
              <div className="w-8 flex justify-center">
                <FaEnvelope className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </div>
              <span className="truncate ml-2">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center text-gray-600 text-sm">
              <div className="w-8 flex justify-center">
                <FaPhone className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
              <span className="ml-2" style={phoneStyle}>{user.phone}</span>
            </div>
          )}
          {user.city && (
            <div className="flex items-center text-gray-600 text-sm">
              <div className="w-8 flex justify-center">
                <FaMapMarkerAlt className="w-4 h-4 text-red-500 flex-shrink-0" />
              </div>
              <span className="truncate ml-2">{getTranslatedCity(user.city)}</span>
            </div>
          )}
          {user.job && (
            <div className="flex items-center text-gray-600 text-sm">
              <div className="w-8 flex justify-center">
                <FaBriefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
              </div>
              <span className="truncate ml-2">{getTranslatedJob(user.job)}</span>
            </div>
          )}
        </div>

        {/* Stats - Organized */}
        <div className="border-t border-gray-100 pt-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-500">
              <div className="w-8 flex justify-center">
                <FaStar className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium ml-2">{user.rating || 0}</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <FaEye className="w-3 h-3 mr-1 text-blue-500" />
                <span>{user.views || 0}</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="w-3 h-3 mr-1 text-green-500" />
                <span>{user.phoneViews || 0}</span>
              </div>
              {user.createdAt && (
                <div className="flex items-center">
                  <FaCalendarAlt className="w-3 h-3 mr-1 text-gray-400" />
                  <span>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Width Edit Button */}
        <button
          onClick={() => onEdit(user)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-md hover:shadow-lg"
        >
          <FaEdit className="w-4 h-4" />
          Edit User
        </button>
      </div>
    </div>
  );
}