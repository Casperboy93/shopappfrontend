import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import Logged from '../loggedinas/Logged';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loggedUser, setLoggedUser] = useState<{ role: string } | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { to: '/', label: t('navigation.home') },
    { to: '/search', label: t('navigation.search') },
    { to: '/about', label: t('navigation.about') },
    { to: '/services', label: t('navigation.services') },
    { to: '/contact', label: t('navigation.contact') },
    { to: '/register', label: t('navigation.register') },
  ];

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
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const allLinks = [
    ...navLinks,
    ...(loggedUser?.role === 'ADMIN' || loggedUser?.role === 'SUPERADMIN'
      ? [{ to: '/admin', label: t('navigation.admin') }]
      : [])
  ];

  return (
    <>
      {/* Add CSS animations to the document head */}
      <style>
        {`
          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .nav-item-enter {
            animation: slideInDown 0.6s ease-out forwards;
          }
          
          .mobile-nav-item-enter {
            animation: slideInLeft 0.6s ease-out forwards;
          }
        `}
      </style>
      
      <header className="bg-dark-950/95 text-white sticky top-0 z-50 border-b border-golden-600/30 backdrop-blur-md shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo with enhanced animation */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-golden-600 bg-clip-text hover:scale-110 transition-all duration-300 ease-out transform hover:rotate-1 hover:text-golden-400"
          >
            <span className="inline-block transition-all duration-300 hover:animate-pulse">
              {t('home.title')}
            </span>
          </Link>

          {/* Desktop Navigation with enhanced animations */}
          <div className="hidden md:flex items-center gap-6 flex-grow justify-end">
            {allLinks.map((link, index) => {
              const isActive = location.pathname === link.to;
              const isHovered = hoveredLink === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onMouseEnter={() => setHoveredLink(link.to)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`group relative text-sm font-medium pb-1 transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:scale-105 nav-item-enter ${
                    isActive ? 'text-golden-400 font-semibold' : 'text-white/80 hover:text-golden-300'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <span className="relative z-10 transition-all duration-300">
                    {link.label}
                  </span>
                  
                  {/* Animated underline */}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-golden-400 to-golden-600 transition-all duration-300 transform ${
                      isActive || isHovered ? 'w-full scale-x-100' : 'w-0 scale-x-0'
                    }`}
                  />
                  
                  {/* Hover background effect */}
                  <span
                    className={`absolute inset-0 -z-10 bg-gradient-to-r from-golden-500/10 to-emerald-custom-500/10 rounded-lg transition-all duration-300 transform ${
                      isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                    }`}
                    style={{ padding: '8px 12px', margin: '-8px -12px' }}
                  />
                </Link>
              );
            })}

            <LanguageSwitcher />
            
            <div className="ml-4 transform transition-all duration-300 hover:scale-105">
              <Logged />
            </div>
          </div>

          {/* Mobile menu button with enhanced animation */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative text-2xl text-white hover:text-golden-400 focus:outline-none transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            >
              <span className={`absolute inset-0 transition-all duration-300 transform ${
                menuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
              }`}>
                <HiMenu />
              </span>
              <span className={`absolute inset-0 transition-all duration-300 transform ${
                menuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
              }`}>
                <HiX />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu with enhanced animations */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div
            ref={menuRef}
            className="bg-dark-950/98 border-t border-golden-600/30 backdrop-blur-lg px-4 py-6 shadow-2xl"
          >
            <nav className="flex flex-col space-y-1">
              {allLinks.map((link, index) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`group relative text-sm font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${
                      isActive 
                        ? 'text-golden-400 font-semibold bg-golden-500/10 border-l-4 border-golden-400' 
                        : 'text-white/80 hover:text-golden-300 hover:bg-golden-500/5'
                    } ${menuOpen ? 'mobile-nav-item-enter' : ''}`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
                        isActive ? 'bg-golden-400 scale-100' : 'bg-white/30 scale-75 group-hover:bg-golden-300 group-hover:scale-100'
                      }`} />
                      {link.label}
                    </span>
                    
                    {/* Mobile hover effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-golden-500/5 to-emerald-custom-500/5 rounded-lg transition-all duration-300 transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100" />
                  </Link>
                );
              })}
              
              {/* Mobile Language Switcher and Logged component */}
              <div className="mt-4 pt-4 border-t border-golden-600/20 space-y-3">
                <div className="px-4">
                  <LanguageSwitcher />
                </div>
                <div className="transform transition-all duration-300 hover:scale-105">
                  <Logged />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
