// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Header from './components/common/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import AdvancedSearch from './pages/AdvancedSearch';
import Services from './pages/Services';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';

function App() {
  const { i18n, t } = useTranslation();
  
  // Apply font class based on current language
  useEffect(() => {
    const root = document.documentElement;
    if (i18n.language === 'ar') {
      root.classList.add('font-arabic');
      root.classList.remove('font-primary');
      root.setAttribute('dir', 'rtl');
    } else {
      root.classList.add('font-primary');
      root.classList.remove('font-arabic');
      root.setAttribute('dir', 'ltr');
    }
  }, [i18n.language]);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/advanced-search" element={<AdvancedSearch />} />
          </Routes>
        </main>

        <footer className="bg-dark-950 border-t border-golden-600/20 text-white text-center py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-golden-400 font-semibold">{t('home.title')}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">&copy; {new Date().getFullYear()} {t('footer.allRightsReserved')}</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
