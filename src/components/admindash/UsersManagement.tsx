// src/components/admindash/UsersManagement.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import UserCard from './commons/UserCard';
import UserEditForm from '../common/UserEditForm';
import { 
  FaExclamationTriangle, 
  FaSpinner,  
  FaSearch,
  FaFilter,
  FaUserCircle,
  FaUser
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
  profileImg?: string;
  portfolio?: string;
}

interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  job: string;
  profileImg: string;
  portfolio: string;
  description: string;
  address: string;
  rating: number;
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
    profileImg: '',
    portfolio: '',
    description: '',
    address: '',
    rating: 0
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
      profileImg: user.profileImg || '',
      portfolio: user.portfolio || '',
      description: (user as any).description || '',
      address: (user as any).address || '',
      rating: user.rating || 0
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      setUpdateLoading(true);
      
      // Clean the form data - convert empty strings to undefined for optional fields
      const cleanedData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email || undefined,
        phone: editFormData.phone || undefined,
        city: editFormData.city || undefined,
        job: editFormData.job || undefined,
        profileImg: editFormData.profileImg || undefined,
        portfolio: editFormData.portfolio || undefined,
        description: editFormData.description || undefined,
        address: editFormData.address || undefined
      };
      
      // Update user data
      const res = await api.patch(`/users/${editingUser._id}`, cleanedData);
      
      // Update rating separately if it has changed
      if (editFormData.rating !== editingUser.rating) {
        await api.patch(`/users/${editingUser._id}/rating`, { rating: editFormData.rating });
      }
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === editingUser._id ? { ...user, ...res.data, rating: editFormData.rating } : user
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
      profileImg: '',
      portfolio: '',
      description: '',
      address: '',
      rating: 0
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
    <>
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

      {/* Edit User Form - Appears under stats when editing */}
      {editingUser && (
        <UserEditForm
          user={editingUser}
          formData={editFormData}
          onFormDataChange={setEditFormData}
          onSave={handleUpdateUser}
          onCancel={handleCancelEdit}
          isLoading={updateLoading}
        />
      )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

    </div>


    </>
  );
}