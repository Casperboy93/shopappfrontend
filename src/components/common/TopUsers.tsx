import { useEffect, useState } from 'react';
import UserCard from '../user/UserCard';
import api from '../../lib/axios';

export default function TopUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users/all-subs') // ✅ only users with role USER
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="py-12 bg-black text-white">
      <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-6">Our Top Workers</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-2">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
