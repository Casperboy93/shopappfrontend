import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserCard from '../components/user/UserCard';
import SearchFilter from '../components/search/SearchFilter';
import api from '../lib/axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  job: string;
  rating: number;
  views: number;
  phoneViews: number;
  description: string;
  profileImg?: string;
}

export default function AdvancedSearch() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const cityQuery = queryParams.get('city') || '';
  const jobQuery = queryParams.get('job') || '';

  useEffect(() => {
    api.get('/users/all-subs')
      .then(res => {
        setAllUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(err => console.error('Error loading users:', err));
  }, []);

  useEffect(() => {
    const result = allUsers.filter((u) => {
      return (
        (cityQuery === '' || u.city.toLowerCase().includes(cityQuery.toLowerCase())) &&
        (jobQuery === '' || u.job.toLowerCase().includes(jobQuery.toLowerCase()))
      );
    });
    setFilteredUsers(result);
  }, [cityQuery, jobQuery, allUsers]);

  const handleFilter = (filters: { city: string; job: string }) => {
    const { city, job } = filters;
    const result = allUsers.filter((u) => {
      return (
        (city === '' || u.city.toLowerCase().includes(city.toLowerCase())) &&
        (job === '' || u.job.toLowerCase().includes(job.toLowerCase()))
      );
    });
    setFilteredUsers(result);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-6">Find Professionals</h1>

        <SearchFilter onFilter={handleFilter} />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
