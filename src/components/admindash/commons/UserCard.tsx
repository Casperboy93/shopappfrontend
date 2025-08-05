import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaEdit,
  FaEye,
  FaStar,
  FaCalendarAlt,
  FaEnvelope,
} from 'react-icons/fa';

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

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export default function UserCard({ user, onEdit }: UserCardProps) {
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
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
      
      {/* Card Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">
                {user.firstName} {user.lastName}
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getRoleBadgeStyle(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:scale-110"
            title="Edit User"
          >
            <FaEdit className="text-lg" />
          </button>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-4">
          {user.email && (
            <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <FaEnvelope className="w-4 h-4 mr-3 text-blue-500" />
              <span className="text-sm truncate">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <FaPhone className="w-4 h-4 mr-3 text-green-500" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}
          {user.city && (
            <div className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <FaMapMarkerAlt className="w-4 h-4 mr-3 text-red-500" />
              <span className="text-sm truncate">{user.city}</span>
            </div>
          )}
          {user.job && (
            <div className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
              <FaBriefcase className="w-4 h-4 mr-3 text-purple-500" />
              <span className="text-sm truncate">{user.job}</span>
            </div>
          )}
        </div>

        {/* Status and Stats */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(user.status)}`}>
              {user.status}
            </span>
            <div className="flex items-center text-yellow-500">
              <FaStar className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{user.rating || 0}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <FaEye className="w-4 h-4 mr-1" />
              </div>
              <div className="text-xs text-gray-600">Profile Views</div>
              <div className="font-bold text-blue-600">{user.views || 0}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <div className="flex items-center justify-center text-green-600 mb-1">
                <FaPhone className="w-4 h-4 mr-1" />
              </div>
              <div className="text-xs text-gray-600">Phone Views</div>
              <div className="font-bold text-green-600">{user.phoneViews || 0}</div>
            </div>
          </div>
          
          {user.createdAt && (
            <div className="flex items-center justify-center text-gray-400 text-xs mt-3">
              <FaCalendarAlt className="w-3 h-3 mr-1" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}