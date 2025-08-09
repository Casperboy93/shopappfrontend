import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaEye, FaPhoneAlt, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import type { User } from '../../types/user';
import api from '../../lib/axios';

interface UserCardProps {
  user: User;
  onViewIncrement?: (userId: string, newViewCount: number) => void;
}

export default function UserCard({ user, onViewIncrement }: UserCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentViews, setCurrentViews] = useState(user.views);

  const handleDetailsClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Increment user views - Fixed endpoint URL
      const response = await api.patch(`/users/${user._id}/views`);
      
      // Update local state with new view count
      if (response.data && typeof response.data.views === 'number') {
        setCurrentViews(response.data.views);
        onViewIncrement?.(user._id, response.data.views);
      } else {
        // Fallback: increment locally if API doesn't return new count
        setCurrentViews(prev => prev + 1);
        onViewIncrement?.(user._id, currentViews + 1);
      }
      
      // Navigate to user profile
      navigate(`/user/${user._id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Still navigate even if view increment fails
      navigate(`/user/${user._id}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Truncate description if too long
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (!text) return t('userCard.noDescription');
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-card-dark rounded-xl shadow-2xl overflow-hidden hover:shadow-golden-500/10 transition-all duration-300 transform hover:-translate-y-1 border border-golden-600/10">
      {/* Profile Image - Full Width */}
      <div className="w-full h-48 relative">
        {user.profileImg ? (
          <img
            src={user.profileImg}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center text-golden-400/60">
            <span className="text-3xl font-bold">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Rating Badge - Overlay */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <FaStar className="text-golden-400 text-xs" />
          <span className="text-white text-xs font-semibold">{(user.rating || 0).toFixed(1)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Name and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-high-contrast mb-1 leading-tight">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center gap-1 text-gray-300 text-sm">
            <FaMapMarkerAlt className="text-golden-400 text-xs" />
            <span>{user.city || t('userCard.locationNotSpecified')}</span>
          </div>
        </div>

        {/* Job Badge */}
        <div className="mb-3">
          <div className="inline-block bg-gradient-emerald text-white text-xs font-medium px-3 py-1 rounded-full">
            {user.job || t('userCard.jobNotSpecified')}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <FaEye className="text-emerald-custom-400" />
            <span>{currentViews}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaPhoneAlt className="text-golden-400" />
            <span>{user.phoneViews || 0}</span>
          </div>
          {/* <div className="text-gray-400">
            <span className="text-xs">/5.0</span>
          </div> */}
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            {truncateDescription(user.description)}
          </p>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleDetailsClick}
          disabled={isLoading}
          className="w-full btn-golden-enhanced py-2 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              {t('userCard.loading')}
            </>
          ) : (
            t('userCard.viewDetails')
          )}
        </button>
      </div>
    </div>
  );
}