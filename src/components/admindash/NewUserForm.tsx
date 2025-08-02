// src/components/admindash/NewUserForm.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { FaUser, FaPhone, FaMapMarkerAlt, FaBriefcase, FaExclamationTriangle, FaSpinner, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

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
  role: string;
  status: string;
}

export default function NewUserForm() {
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
    role: '',
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
      role: user.role,
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
      role: '',
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
    <section className="bg-white shadow-lg rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUser className="mr-3 text-blue-600" />
            Users Management
          </h2>
          <p className="text-gray-600 mt-1">Total: {users.length} users</p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
        >
          <FaSpinner className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Role
          </label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
            <option value="SUPERADMIN">Super Admins</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <FaUser className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-gray-50 flex flex-col"
            >
              {/* User Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'SUPERADMIN' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit User"
                >
                  <FaEdit className="text-sm" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate">
                  {user.firstName} {user.lastName}
                </h3>
                
                <div className="space-y-2 text-xs text-gray-600">
                  {user.phone && (
                    <div className="flex items-center">
                      <FaPhone className="mr-2 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center">
                      <span className="mr-2 flex-shrink-0">📧</span>
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-red-500 flex-shrink-0" />
                      <span className="truncate">{user.city}</span>
                    </div>
                  )}
                  {user.job && (
                    <div className="flex items-center">
                      <FaBriefcase className="mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{user.job}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Stats */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{user.rating || 0}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <FaUser className="mr-1" />
                    <span>{user.views || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="mr-1" />
                    <span>{user.phoneViews || 0}</span>
                  </div>
                </div>
                
                {user.createdAt && (
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={editFormData.city}
                  onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job
                </label>
                <input
                  type="text"
                  value={editFormData.job}
                  onChange={(e) => setEditFormData({...editFormData, job: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="notapproved">Not Approved</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={updateLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
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

      {/* Summary */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Showing {filteredUsers.length} of {users.length} users
            {(searchTerm || filterRole !== 'all') && ' (filtered)'}
          </p>
        </div>
      )}
    </section>
  );
}
