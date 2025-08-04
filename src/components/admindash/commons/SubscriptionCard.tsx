import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaClock, FaEdit, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
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

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit?: (id: string) => void;
}

export default function SubscriptionCard({ subscription, onEdit }: SubscriptionCardProps) {
  const calculateRemainingDays = (endDate: string) => {
    const today = dayjs();
    const end = dayjs(endDate);
    return end.diff(today, 'day');
  };

  const getSubscriptionStatus = (endDate: string) => {
    const remainingDays = calculateRemainingDays(endDate);
    if (remainingDays < 0) return 'expired';
    if (remainingDays <= 7) return 'expiring';
    return 'active';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          icon: FaCheckCircle,
          gradient: 'from-emerald-400 to-teal-500'
        };
      case 'expiring':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: FaExclamationTriangle,
          gradient: 'from-amber-400 to-orange-500'
        };
      case 'expired':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: FaTimesCircle,
          gradient: 'from-red-400 to-pink-500'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: FaClock,
          gradient: 'from-gray-400 to-gray-500'
        };
    }
  };

  const remainingDays = calculateRemainingDays(subscription.endDate);
  const status = getSubscriptionStatus(subscription.endDate);
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const fullName = `${subscription.user.firstName} ${subscription.user.lastName}`;

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-sm`}>
          <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
          <span className={`text-xs font-semibold ${statusConfig.color} capitalize`}>
            {status}
          </span>
        </div>
      </div>

      {/* User Header */}
      <div className="mb-6 pr-20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <FaUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
              {fullName}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaBriefcase className="w-3 h-3" />
              {subscription.user.job || 'No job specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <FaPhone className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <span className="text-gray-500 text-xs block">Phone</span>
            <span className="text-gray-800 font-medium">{subscription.user.phone}</span>
          </div>
        </div>

        {subscription.user.email && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <FaEnvelope className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-500 text-xs block">Email</span>
              <span className="text-gray-800 font-medium truncate block">{subscription.user.email}</span>
            </div>
          </div>
        )}

        {subscription.user.city && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt className="w-3 h-3 text-purple-600" />
            </div>
            <div>
              <span className="text-gray-500 text-xs block">City</span>
              <span className="text-gray-800 font-medium">{subscription.user.city}</span>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Timeline */}
      <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaCalendarAlt className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Subscription Period</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 text-xs block mb-1">Start Date</span>
            <span className="text-gray-800 font-semibold">
              {dayjs(subscription.startDate).format('MMM DD, YYYY')}
            </span>
          </div>
          <div>
            <span className="text-gray-500 text-xs block mb-1">End Date</span>
            <span className="text-gray-800 font-semibold">
              {dayjs(subscription.endDate).format('MMM DD, YYYY')}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700">
              {dayjs().diff(dayjs(subscription.startDate), 'day')} / {dayjs(subscription.endDate).diff(dayjs(subscription.startDate), 'day')} days
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${statusConfig.gradient} transition-all duration-500`}
              style={{
                width: `${Math.min(100, Math.max(0, (dayjs().diff(dayjs(subscription.startDate), 'day') / dayjs(subscription.endDate).diff(dayjs(subscription.startDate), 'day')) * 100))}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Days Remaining */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
          <FaClock className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`font-bold text-lg ${statusConfig.color}`}>
            {remainingDays < 0 ? 
              `Expired ${Math.abs(remainingDays)} days ago` :
              `${remainingDays} days remaining`
            }
          </span>
        </div>
      </div>

      {/* Action Button */}
      {onEdit && (
        <button
          onClick={() => onEdit(subscription._id)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <FaEdit className="w-4 h-4" />
          Edit Subscription
        </button>
      )}
    </div>
  );
}
