// src/components/admindash/UsersManagement.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaExclamationTriangle, 
  FaSpinner, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaEye,
  FaStar,
  FaCalendarAlt,
  FaEnvelope,
  FaUserCircle,
  FaSearch,
  FaFilter
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

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  job: string;
  status: string;
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

function UserCard({ user, onEdit }: UserCardProps) {
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

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    job: '',
    status: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/users');
      
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
      job: user.job || '',
      status: user.status
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      setUpdateLoading(true);
      const res = await api.patch(`/users/${editingUser._id}`, editFormData);
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === editingUser._id ? { ...user, ...res.data } : user
      ));
      
      setEditingUser(null);
      setError(null);
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setError(err.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      job: '',
      status: ''
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const handleRefresh = () => {
    fetchUsers();
  };

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      superAdmins: users.filter(u => u.role === 'SUPERADMIN').length
    };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <section className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-blue-600 text-3xl mr-3" />
          <span className="text-lg text-gray-600">Loading users...</span>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center mb-2">
              <FaUserCircle className="mr-3" />
              Users Management
            </h1>
            <p className="text-blue-100">Manage and monitor all system users</p>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center font-medium"
          >
            <FaSpinner className="mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FaUser className="text-3xl text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Users</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <FaUser className="text-3xl text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Admins</p>
              <p className="text-2xl font-bold">{stats.admins}</p>
            </div>
            <FaUser className="text-3xl text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Super Admins</p>
              <p className="text-2xl font-bold">{stats.superAdmins}</p>
            </div>
            <FaUser className="text-3xl text-red-200" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2" />
              Search Users
            </label>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <FaSearch className="absolute left-3 top-11 text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2" />
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Roles</option>
              <option value="USER">Users</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPERADMIN">Super Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
            <div>
              <h3 className="text-red-800 font-medium text-lg">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users Grid */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <FaUserCircle className="mx-auto text-gray-400 text-6xl mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {searchTerm || filterRole !== 'all' ? 'No users match your filters' : 'No users found'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'Users will appear here once they are registered'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onEdit={handleEditUser}
                />
              ))}
            </div>
            
            {/* Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Showing {filteredUsers.length} of {users.length} users
                {(searchTerm || filterRole !== 'all') && ' (filtered)'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <FaEdit className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Edit User Information</h3>
                    <p className="text-blue-100 text-sm">
                      {editingUser.firstName} {editingUser.lastName} • {editingUser.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-blue-500" />
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-blue-500" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-green-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2 text-green-500" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                    City
                  </label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBriefcase className="inline mr-2 text-purple-500" />
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.job}
                    onChange={(e) => setEditFormData({...editFormData, job: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter job title"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="active">Active</option>
                  <option value="notapproved">Not Approved</option>
                </select>
              </div>

              {/* Role Display (Read-only) */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role (Read-only)
                </label>
                <div className="flex items-center">
                  <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    editingUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    editingUser.role === 'SUPERADMIN' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {editingUser.role}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    Role cannot be modified through this interface
                  </span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updateLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center disabled:opacity-50 font-medium"
              >
                {updateLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}