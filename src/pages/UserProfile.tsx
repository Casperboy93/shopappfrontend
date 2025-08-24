import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaMapMarkerAlt, FaStar, FaEye } from 'react-icons/fa';
import { MOROCCAN_CITIES } from '../consts/cities';
import { JOB_TYPES } from '../consts/jobs';
import api from '../lib/axios';

export default function UserProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  // Helper function to get translated city name
  const getTranslatedCity = (cityValue: string) => {
    if (!cityValue) return '';
    
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
    if (!jobValue) return '';
    
    // Try to find the job key that matches the stored value
    const jobKey = JOB_TYPES.find(key => {
      const keyWithoutPrefix = key.replace('jobs.', '');
      return keyWithoutPrefix.toLowerCase() === jobValue.toLowerCase() || 
             t(key).toLowerCase() === jobValue.toLowerCase();
    });
    
    return jobKey ? t(jobKey) : jobValue;
  };

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setNotFound(false);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        setNotFound(true);
      });
  }, [id]);

  const handlePhoneClick = async () => {
    if (!phoneRevealed) {
      try {
        // Try to increment phoneViews count
        await api.patch(`/users/${id}/phoneviews`);
        setPhoneRevealed(true);
        
        // Update local user state to reflect the increment
        setUser((prev: any) => ({
          ...prev,
          phoneViews: (prev.phoneViews || 0) + 1
        }));
      } catch (error) {
        console.error('Error incrementing phone views:', error);
        // Still reveal the phone number even if API call fails
        setPhoneRevealed(true);
      }
    } else {
      // Make the call
      window.open(`tel:${user.phone}`);
    }
  };

  if (notFound) {
    return <p className="text-center text-red-400 mt-10">{t('user.userNotFound')}</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-white">{t('user.loading')}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-white px-4 py-10">
      <div className="max-w-3xl mx-auto backdrop-blur bg-white/5 border border-golden-600/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-8 bg-gradient-to-br from-golden-500/5 to-emerald-custom-500/5 border-b border-golden-600/20">
          {/* Profile Image */}
          {user.profileImg ? (
            <img
              src={user.profileImg}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-32 h-32 rounded-full border-2 border-golden-500/50 object-cover shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-2 border-golden-500/50 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center text-golden-400/60 shadow-lg">
              <span className="text-sm font-medium">{t('user.noImage')}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold bg-gradient-golden text-slate-800 pl-4">
              {user.firstName} {user.lastName}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-gray-300 text-sm">
              <FaMapMarkerAlt className="text-golden-400" />
              <span>{getTranslatedCity(user.city)}</span>
            </div>

            <div className="mt-3 inline-block bg-gradient-emerald text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
              {getTranslatedJob(user.job)}
            </div>

            <div className="flex items-center gap-2 text-golden-300 mt-4 text-sm">
              <FaStar className="text-golden-400" />
              <span className="font-semibold">{user.rating} / 5.0</span>
            </div>

            <div className="text-gray-400 text-xs mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaEye className="text-emerald-custom-400" />
                <span>{t('user.viewsCount', { count: user.views })}</span>
              </div>
              {phoneRevealed && (
                <div className="flex items-center gap-1">
                  <FaPhoneAlt className="text-golden-400" />
                  <span>{t('user.phoneViewsCount', { count: user.phoneViews })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-8 border-t border-golden-600/20 text-gray-300 leading-relaxed">
          <h3 className="text-lg font-semibold text-white mb-3">{t('user.about')}</h3>
          <p className="text-gray-300">{user.description}</p>
        </div>

        {/* Portfolio Section - Centered Image Display */}
        {user.portfolio && (
          <div className="p-8 border-t border-golden-600/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">{t('user.portfolio')}</h3>
            <div className="flex justify-center">
              {user.portfolio ? (
                <img
                  src={user.portfolio}
                  alt={`${user.firstName} ${user.lastName} Portfolio`}
                  className="max-w-full max-h-96 rounded-xl border-2 border-golden-500/50 object-contain shadow-lg hover:shadow-xl transition-shadow duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : (
                <div className="w-full max-w-md h-48 rounded-xl border-2 border-golden-500/50 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center text-golden-400/60 shadow-lg">
                  <span className="text-sm font-medium">{t('user.noPortfolio')}</span>
                </div>
              )}
              {/* Fallback message for broken images */}
              <div className="hidden w-full max-w-md h-48 rounded-xl border-2 border-golden-500/50 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center text-golden-400/60 shadow-lg">
                <span className="text-sm font-medium">{t('user.noPortfolio')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="p-8 border-t border-golden-600/20 bg-gradient-to-r from-golden-500/5 to-emerald-custom-500/5 flex justify-end">
          {user.phone ? (
            <button
              onClick={handlePhoneClick}
              className="flex items-center gap-3 bg-gradient-golden text-dark-900 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <FaPhoneAlt />
              {phoneRevealed ? t('user.callPhone', { phone: user.phone }) : t('user.revealPhone')}
            </button>
          ) : (
            <span className="text-gray-400 italic text-sm">{t('user.phoneNotPublic')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
