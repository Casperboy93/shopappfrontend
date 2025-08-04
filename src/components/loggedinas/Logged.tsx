import { FaUserCircle, FaSignOutAlt, FaCrown, FaUser, FaChevronDown } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface UserInfo {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export default function Logged() {
  const { t } = useTranslation();
  const [loggedUser, setLoggedUser] = useState<UserInfo | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setLoggedUser({
            email: parsed.email,
            role: parsed.role,
            firstName: parsed.firstName,
            lastName: parsed.lastName
          });
        } catch (e) {
          console.error('Invalid user data in localStorage');
          setLoggedUser(null);
        }
      } else {
        setLoggedUser(null);
      }
    };

    loadUser();

    // Watch for changes to localStorage (e.g. logout in another tab)
    const handleStorage = () => loadUser();
    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedUser(null);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'super_admin':
        return <FaCrown className="text-golden-400" />;
      default:
        return <FaUser className="text-emerald-custom-400" />;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'super_admin':
        return 'bg-gradient-to-r from-golden-500/20 to-golden-600/20 text-golden-400 border-golden-500/30';
      default:
        return 'bg-gradient-to-r from-emerald-custom-500/20 to-emerald-custom-600/20 text-emerald-custom-400 border-emerald-custom-500/30';
    }
  };

  const getDisplayName = () => {
    if (loggedUser?.firstName && loggedUser?.lastName) {
      return `${loggedUser.firstName} ${loggedUser.lastName}`;
    }
    return loggedUser?.email?.split('@')[0] || 'User';
  };

  if (!loggedUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main User Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="group flex items-center gap-3 bg-gradient-to-r from-dark-800/80 to-dark-900/80 backdrop-blur-md border border-golden-600/30 hover:border-golden-500/50 px-4 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-golden-500/50"
      >
        {/* Avatar Container */}
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-golden-400/20 to-emerald-custom-500/20 border border-golden-500/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <FaUserCircle className="text-golden-400 text-xl transition-all duration-300 group-hover:text-golden-300" />
          </div>
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-custom-500 border-2 border-dark-900 rounded-full animate-pulse"></div>
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden lg:flex flex-col text-left min-w-0">
          <span className="font-semibold text-white text-sm truncate max-w-[120px] transition-colors duration-300 group-hover:text-golden-300">
            {getDisplayName()}
          </span>
          <div className="flex items-center gap-1.5">
            {getRoleIcon(loggedUser.role)}
            <span className="text-xs text-gray-300 capitalize transition-colors duration-300 group-hover:text-gray-200">
              {loggedUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <FaChevronDown 
          className={`text-gray-400 text-xs transition-all duration-300 group-hover:text-golden-400 ${
            isDropdownOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-dark-900/95 backdrop-blur-xl border border-golden-600/30 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-golden-600/20 bg-gradient-to-r from-golden-500/5 to-emerald-custom-500/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-golden-400/20 to-emerald-custom-500/20 border border-golden-500/30 flex items-center justify-center">
                <FaUserCircle className="text-golden-400 text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">
                  {getDisplayName()}
                </h3>
                <p className="text-xs text-gray-300 truncate">
                  {loggedUser.email}
                </p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-medium mt-1 ${
                  getRoleBadgeStyle(loggedUser.role)
                }`}>
                  {getRoleIcon(loggedUser.role)}
                  <span className="capitalize">{loggedUser.role.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Profile Link */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                if (loggedUser.role.toLowerCase().includes('admin')) {
                  navigate('/admin');
                } else {
                  // Navigate to user profile when implemented
                  console.log('Navigate to profile');
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-golden-500/10 hover:to-emerald-custom-500/10 rounded-xl transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <FaUser className="text-blue-400 text-sm" />
              </div>
              <div>
                <div className="text-sm font-medium">
                  {loggedUser.role.toLowerCase().includes('admin') ? 'Admin Dashboard' : 'View Profile'}
                </div>
                <div className="text-xs text-gray-400">
                  {loggedUser.role.toLowerCase().includes('admin') ? 'Manage platform' : 'Edit your information'}
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaSignOutAlt className="text-red-400 text-sm" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </div>
                <div className="text-xs text-gray-400">
                  {isLoggingOut ? 'Please wait' : 'End your session'}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
