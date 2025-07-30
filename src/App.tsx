// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
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

        <footer className="bg-gray-800 text-white text-center py-4 text-sm">
          &copy; {new Date().getFullYear()} BS Platform. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}
