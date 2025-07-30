import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import Logged from '../loggedinas/Logged';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/search', label: 'Search' },
  { to: '/contact', label: 'Contact' },
  { to: '/register', label: 'Register' },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loggedUser, setLoggedUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setLoggedUser({ role: parsed.role });
      } catch {
        setLoggedUser(null);
      }
    } else {
      setLoggedUser(null);
    }
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b border-white/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow-400">
          BS Platform
        </Link>

        <div className="hidden md:flex items-center gap-6 flex-grow justify-end">
          {[...navLinks, ...(loggedUser?.role === 'ADMIN' || loggedUser?.role === 'SUPERADMIN'
            ? [{ to: '/admin', label: 'Admin' }]
            : [])].map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium pb-1 transition-all duration-200 ease-in-out ${
                  isActive ? 'text-yellow-400 font-semibold' : 'text-white/80 hover:text-yellow-400'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 w-full bg-yellow-400 transition-transform duration-300 transform ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}

          <Logged />
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-white hover:text-yellow-400 focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-black border-t border-white/20 backdrop-blur px-4 py-3"
        >
          <nav className="flex flex-col space-y-2">
            {[...navLinks, ...(loggedUser?.role === 'ADMIN' || loggedUser?.role === 'SUPERADMIN'
              ? [{ to: '/admin', label: 'Admin' }]
              : [])].map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-yellow-400 font-semibold' : 'text-white/80 hover:text-yellow-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
