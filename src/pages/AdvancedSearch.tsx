import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserCard from '../components/user/UserCard';
import SearchFilter from '../components/search/SearchFilter';
import api from '../lib/axios';
import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilter } from 'react-icons/fa';
import type { User } from '../types/user';

type SortOption = 'rating' | 'views' | 'phoneViews' | 'name' | 'newest';
type SortDirection = 'asc' | 'desc';

export default function AdvancedSearch() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const usersPerPage = 12;

  // Get URL parameters
  const urlParams = new URLSearchParams(location.search);
  const cityFromUrl = urlParams.get('city') || '';
  const jobFromUrl = urlParams.get('job') || '';

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Set filters from URL parameters
    setCityFilter(cityFromUrl);
    setJobFilter(jobFromUrl);
  }, [cityFromUrl, jobFromUrl]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/all-subs');
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Expected array but got:', response.data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(t('advancedSearch.failedToLoad'));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = cityFilter === '' || user.city.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesJob = jobFilter === '' || user.job.toLowerCase().includes(jobFilter.toLowerCase());
      
      return matchesSearch && matchesCity && matchesJob;
    });
  }, [users, searchTerm, cityFilter, jobFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'newest':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [filteredUsers, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  const handleFilter = (filters: { city: string; job: string }) => {
    setCityFilter(filters.city);
    setJobFilter(filters.job);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.job) params.set('job', filters.job);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('advancedSearch.loadingUsers')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="btn-golden-enhanced px-6 py-2 rounded-lg"
          >
            {t('advancedSearch.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-golden-400">{t('advancedSearch.title').split(' ')[0]}</span>{' '}
            <span className="text-white">{t('advancedSearch.title').split(' ')[1]}</span>
          </h1>
          <p className="text-gray-400 text-lg">{t('advancedSearch.subtitle')}</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('advancedSearch.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-golden-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-golden-500 transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 border border-golden-600/30 rounded-lg text-white hover:border-golden-500 transition-colors"
            >
              <FaFilter />
              {showFilters ? t('advancedSearch.hideFilters') : t('advancedSearch.showFilters')}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="max-w-2xl mx-auto">
              <SearchFilter
                onFilter={handleFilter}
                initialCity={cityFilter}
                initialJob={jobFilter}
              />
            </div>
          )}

          {/* Sort Options */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: 'rating', label: t('advancedSearch.sortOptions.rating') },
              { key: 'views', label: t('advancedSearch.sortOptions.views') },
              { key: 'phoneViews', label: t('advancedSearch.sortOptions.phoneViews') },
              { key: 'name', label: t('advancedSearch.sortOptions.name') },
              { key: 'newest', label: t('advancedSearch.sortOptions.newest') }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSort(key as SortOption)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  sortBy === key
                    ? 'bg-golden-500 text-dark-900'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                }`}
              >
                {label}
                {sortBy === key && (
                  sortDirection === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            {t('advancedSearch.resultsInfo.showing')} {paginatedUsers.length} {t('advancedSearch.resultsInfo.of')} {sortedUsers.length} {t('advancedSearch.resultsInfo.professionals')}
            {(cityFilter || jobFilter || searchTerm) && (
              <span className="text-golden-400"> {t('advancedSearch.resultsInfo.filtered')}</span>
            )}
          </p>
        </div>

        {/* Users Grid */}
        {paginatedUsers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm || cityFilter || jobFilter ? t('advancedSearch.noResults.noProfessionalsMatch') : t('advancedSearch.noResults.noProfessionalsFound')}
            </h3>
            <p className="text-gray-500">
              {searchTerm || cityFilter || jobFilter
                ? t('advancedSearch.noResults.tryAdjusting')
                : t('advancedSearch.noResults.checkBackLater')
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {paginatedUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-dark-800 border border-golden-600/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-golden-500 transition-colors"
            >
              {t('advancedSearch.pagination.previous')}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-golden-500 text-dark-900'
                    : 'bg-dark-800 border border-golden-600/30 text-white hover:border-golden-500'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-dark-800 border border-golden-600/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-golden-500 transition-colors"
            >
              {t('advancedSearch.pagination.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
