import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserCard from '../user/UserCard';
import api from '../../lib/axios';
import { FaSearch, FaFilter, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { MOROCCAN_CITIES } from '../../consts/cities';
import { JOB_TYPES } from '../../consts/jobs';
import type { User } from '../../types/user';

type SortOption = 'random' | 'rating' | 'views' | 'phoneViews' | 'newest';
type FilterOption = 'all' | 'top-rated' | 'most-viewed' | 'recent';

export default function TopUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('random'); // default to random
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showCount, setShowCount] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [shuffleNonce, setShuffleNonce] = useState(0); // triggers re-shuffle on demand

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/all-subs');

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(t('topUsers.errorMessage'));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Helpers ----
  const fisherYatesShuffle = useCallback(<T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  // Filter & search users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // handle missing string fields gracefully
      const firstName = (user.firstName || '').toLowerCase();
      const lastName = (user.lastName || '').toLowerCase();
      const city = (user.city || '').toLowerCase();
      const job = (user.job || '').toLowerCase();
      const query = (searchTerm || '').toLowerCase();

      const matchesTranslatedCity = (term: string) => {
        const q = term.toLowerCase();
        return MOROCCAN_CITIES.some(cityKey => {
          const translatedCity = (t(cityKey) || '').toLowerCase();
          const rawKey = cityKey.replace('cities.', '').toLowerCase();
          return translatedCity.includes(q) && (city.includes(rawKey) || city.includes(translatedCity));
        });
      };

      const matchesTranslatedJob = (term: string) => {
        const q = term.toLowerCase();
        return JOB_TYPES.some(jobKey => {
          const translatedJob = (t(jobKey) || '').toLowerCase();
          const rawKey = jobKey.replace('jobs.', '').toLowerCase();
          return translatedJob.includes(q) && (job.includes(rawKey) || job.includes(translatedJob));
        });
      };

      const matchesSearch =
        query === '' ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        city.includes(query) ||
        job.includes(query) ||
        matchesTranslatedCity(query) ||
        matchesTranslatedJob(query);

      return matchesSearch;
    });

    // Apply filters
    switch (filterBy) {
      case 'top-rated':
        filtered = filtered.filter(u => (u.rating ?? 0) >= 4.5);
        break;
      case 'most-viewed':
        filtered = filtered.filter(u => (u.views ?? 0) >= 100);
        break;
      case 'recent': {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(u => u.createdAt && new Date(u.createdAt) >= thirtyDaysAgo);
        break;
      }
      default:
        break;
    }

    return filtered;
  }, [users, searchTerm, filterBy, t]);

  // Sort or shuffle users
  const sortedUsers = useMemo(() => {
    if (sortBy === 'random') {
      // include shuffleNonce so the Shuffle button can reshuffle
      return fisherYatesShuffle(filteredUsers);
    }

    return [...filteredUsers].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'views':
          return (b.views ?? 0) - (a.views ?? 0);
        case 'phoneViews':
          return (b.phoneViews ?? 0) - (a.phoneViews ?? 0);
        case 'newest': {
          const aDate = new Date(a.createdAt ?? 0).getTime();
          const bDate = new Date(b.createdAt ?? 0).getTime();
          return bDate - aDate;
        }
        default:
          return (b.rating ?? 0) - (a.rating ?? 0);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredUsers, sortBy, fisherYatesShuffle, shuffleNonce]);

  const displayedUsers = sortedUsers.slice(0, showCount);

  const handleViewAll = () => {
    navigate('/advanced-search');
  };

  const handleLoadMore = () => {
    setShowCount(prev => prev + 8);
  };

  const handleShuffleAgain = () => {
    // increase nonce to re-run useMemo and reshuffle
    setShuffleNonce(n => n + 1);
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-custom-500/5"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
          <FaSpinner className="animate-spin text-golden-500 text-4xl mb-4" />
          <p className="text-gray-300 text-lg">{t('topUsers.loadingMessage')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-custom-500/5"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
          <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="btn-golden-enhanced px-6 py-2 rounded-lg"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-custom-500/5"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className=" bg-clip-text text-emerald-600">{t('topUsers.title.ourTop')}</span>{' '}
            <span className="text-white">{t('topUsers.title.professionals')}</span>
          </h2>
          <p className="text-gray-400 text-lg mb-6">{t('topUsers.subtitle')}</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-golden-400">{users.length}</div>
              <div className="text-sm text-gray-400">{t('topUsers.stats.totalProfessionals')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {users.filter(u => (u.rating ?? 0) >= 4.5).length}
              </div>
              <div className="text-sm text-gray-400">{t('topUsers.stats.topRated')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {new Set(users.map(u => u.city)).size}
              </div>
              <div className="text-sm text-gray-400">{t('topUsers.stats.citiesCovered')}</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-8 px-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-golden-400 text-sm" />
              <input
                type="text"
                placeholder={t('topUsers.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-800/50 border border-golden-600/30 rounded-lg pl-10 pr-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:border-golden-500 focus:outline-none transition-colors backdrop-blur text-sm sm:text-base"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 sm:py-3 rounded-lg border transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                showFilters
                  ? 'bg-golden-500/20 border-golden-500 text-golden-400'
                  : 'bg-dark-800/50 border-golden-600/30 text-white hover:border-golden-500'
              }`}
            >
              <FaFilter className="text-sm" />
              <span className="hidden sm:inline">{t('common.filter')}</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('topUsers.sortBy')}</label>
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full bg-dark-800/50 border border-golden-600/30 rounded-lg px-3 sm:px-4 py-2 text-white focus:border-golden-500 focus:outline-none transition-colors backdrop-blur text-sm sm:text-base"
                  >
                    <option value="random">{t('topUsers.sortOptions.random')}</option>
                    <option value="rating">{t('topUsers.sortOptions.highestRating')}</option>
                    <option value="views">{t('topUsers.sortOptions.mostViews')}</option>
                    <option value="phoneViews">{t('topUsers.sortOptions.mostPhoneViews')}</option>
                    <option value="newest">{t('topUsers.sortOptions.newest')}</option>
                  </select>

                  {sortBy === 'random' && (
                    <button
                      type="button"
                      onClick={handleShuffleAgain}
                      title={t('topUsers.shuffleAgain')}
                      className="shrink-0 px-3 py-2 rounded-lg border bg-dark-800/50 border-golden-600/30 text-white hover:border-golden-500 transition-colors"
                    >
                      🔀
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('topUsers.filterBy')}</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="w-full bg-dark-800/50 border border-golden-600/30 rounded-lg px-3 sm:px-4 py-2 text-white focus:border-golden-500 focus:outline-none transition-colors backdrop-blur text-sm sm:text-base"
                >
                  <option value="all">{t('topUsers.filterOptions.allProfessionals')}</option>
                  <option value="top-rated">{t('topUsers.filterOptions.topRated')}</option>
                  <option value="most-viewed">{t('topUsers.filterOptions.mostViewed')}</option>
                  <option value="recent">{t('topUsers.filterOptions.recent')}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <p className="text-gray-400 text-sm sm:text-base">
            {t('topUsers.showingResults', {
              displayed: displayedUsers.length,
              total: sortedUsers.length
            })}
            {(searchTerm || filterBy !== 'all') && (
              <span className="text-golden-400"> {t('topUsers.filtered')}</span>
            )}
          </p>
        </div>

        {/* Users Grid */}
        {displayedUsers.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">
              {searchTerm || filterBy !== 'all'
                ? t('topUsers.noResults.noProfessionalsMatch')
                : t('topUsers.noResults.noProfessionalsFound')}
            </h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              {searchTerm || filterBy !== 'all'
                ? t('topUsers.noResults.tryAdjusting')
                : t('topUsers.noResults.checkBackLater')}
            </p>
            {(searchTerm || filterBy !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                }}
                className="btn-golden-enhanced px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
              >
                {t('common.clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 px-4 mb-6 sm:mb-8">
              {displayedUsers.map((user) => (
                <UserCard key={user._id || user.id} user={user} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-3 sm:space-y-4 px-4">
              {showCount < sortedUsers.length && (
                <button
                  onClick={handleLoadMore}
                  className="bg-dark-800/50 border border-golden-600/30 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:border-golden-500 transition-all duration-200 backdrop-blur mr-0 sm:mr-4 mb-3 sm:mb-0 text-sm sm:text-base block sm:inline-block w-full sm:w-auto"
                >
                  {t('topUsers.loadMore', { remaining: sortedUsers.length - showCount })}
                </button>
              )}

              <button
                onClick={handleViewAll}
                className="btn-golden-enhanced px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base block sm:inline-block w-full sm:w-auto"
              >
                {t('topUsers.viewAllProfessionals')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
