// src/pages/Home.tsx
import TopUsers from '../components/common/TopUsers';
import Search from '../components/search/Search';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero / Presentation */}
      <section className="bg-black text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gold">Welcome</span> to BS Platform
        </h1>
        <p className="max-w-2xl mx-auto text-white/80">
          Connect with skilled workers in your city. Search, hire, and manage
          services easily.
        </p>
      </section>

      {/* Search */}
      <section className="py-8 bg-gray-100 ">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">
          Find a Worker
        </h2>
        <Search />
      </section>

      {/* How to Start */}
      <section className="py-12 w-full bg-amber-300 mx-auto text-center px-4">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          How to Start & Publish Yourself as a Worker
        </h2>
        <p className="text-gray-700 mb-6">
          Register your account, complete your profile with your skills and
          city, and start offering your services to clients nearby. Build
          your reputation and get hired faster!
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-gold text-black px-6 py-2 rounded shadow hover:bg-black hover:text-white transition"
        >
          Start Now
        </button>
      </section>

      {/* Top 5 Users */}
      <TopUsers />
    </div>
  );
}
