import { FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  email: string;
  role: string;
}

export default function Logged() {
  const [loggedUser, setLoggedUser] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const email = parsed.email;
          const role = parsed.role;
          setLoggedUser({ email, role });
        } catch (e) {
          console.error('Invalid user data in localStorage');
        }
      } else {
        setLoggedUser(null); // Clear state if no user
      }
    };

    loadUser();

    // Optional: watch for changes to localStorage (e.g. logout in another tab)
    const handleStorage = () => loadUser();
    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedUser(null);
    navigate('/login');
  };

  if (!loggedUser) return null;

  return (
    <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full shadow-sm">
      <FaUserCircle className="text-blue-600 text-2xl" />

      <div className="flex flex-col text-sm text-gray-700">
        <span className="font-semibold">{loggedUser.email}</span>
        <span className="text-xs text-gray-500 capitalize">{loggedUser.role}</span>
      </div>

      <button
        onClick={handleLogout}
        className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full transition"
      >
        Logout
      </button>
    </div>
  );
}
