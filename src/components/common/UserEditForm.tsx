import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaSave, 
  FaTimes,
  FaEnvelope,
  FaUserCircle,
  FaImage,
  FaLink,
  FaFileAlt,
  FaHome,
  FaStar
} from 'react-icons/fa';
import { MOROCCAN_CITIES } from '../../consts/cities';
import { JOB_TYPES } from '../../consts/jobs';

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
  description?: string;
  address?: string;
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

interface UserEditFormProps {
  user: User;
  formData: EditFormData;
  onFormDataChange: (data: EditFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function UserEditForm({
  user,
  formData,
  onFormDataChange,
  onSave,
  onCancel,
  isLoading = false
}: UserEditFormProps) {
  const { t } = useTranslation();

  const handleInputChange = (field: keyof EditFormData, value: string | number) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200/50 mb-8 transform transition-all duration-300 ease-in-out animate-slideDown">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <FaUserCircle className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Edit User Profile</h3>
              <p className="text-blue-100 text-sm">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
      </div>
      
      {/* Form Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-blue-500" />
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
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
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
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
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
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
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
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
            <select
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select a city</option>
              {MOROCCAN_CITIES.map((cityKey) => (
                <option key={cityKey} value={cityKey.replace('cities.', '')}>
                  {t(cityKey)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBriefcase className="inline mr-2 text-purple-500" />
              Job Title
            </label>
            <select
              value={formData.job}
              onChange={(e) => handleInputChange('job', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select a job</option>
              {JOB_TYPES.map((jobKey) => (
                <option key={jobKey} value={jobKey.replace('jobs.', '')}>
                  {t(jobKey)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaHome className="inline mr-2 text-orange-500" />
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaImage className="inline mr-2 text-pink-500" />
              Profile Image URL
            </label>
            <input
              type="url"
              value={formData.profileImg}
              onChange={(e) => handleInputChange('profileImg', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter profile image URL"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaLink className="inline mr-2 text-indigo-500" />
            Portfolio URL
          </label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={(e) => handleInputChange('portfolio', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter portfolio URL"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaFileAlt className="inline mr-2 text-teal-500" />
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Enter description"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaStar className="inline mr-2 text-yellow-500" />
            Rating (0-5)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter rating (0-5)"
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 rounded-b-xl px-6 py-4 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center"
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
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
  );
}