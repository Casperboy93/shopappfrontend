import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import dayjs from 'dayjs';

interface Subscription {
  id: number;
  user: {
    id: number;
    phone: string;
  };
  startDate: string;
  endDate: string;
}

export default function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userPhone, setUserPhone] = useState('');
  const [duration, setDuration] = useState(30); // default duration 30 days
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get('/subscriptions');
      if (!Array.isArray(res.data)) throw new Error('Expected an array');
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    }
  };

  const calculateRemainingDays = (endDate: string) => {
    const today = dayjs();
    const end = dayjs(endDate);
    const diff = end.diff(today, 'day');
    return Math.max(diff, 0); // Never go below zero
  };
  

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userRes = await api.get(`/users/by-phone/${userPhone}`);
      const userId = userRes.data.id;

      const startDate = new Date().toISOString();
      const endDate = dayjs().add(duration, 'day').toISOString();

      await api.post('/subscriptions', { userId, startDate, endDate });

      setSuccess('Subscription added successfully!');
      setUserPhone('');
      setDuration(30);
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error adding subscription:', err);
      setError(err.response?.data?.message || 'Failed to add subscription');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Subscriptions</h2>

      {/* Add Subscription Form */}
      <form onSubmit={handleAddSubscription} className="mb-6 p-4 border rounded bg-white">
        <h3 className="font-semibold mb-2">Add New Subscription</h3>
        <div className="flex gap-4 mb-2">
          <input
            type="text"
            placeholder="User phone"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            required
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            placeholder="Days (e.g. 30)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
            className="border p-2 rounded w-1/4"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>

      {/* Table */}
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">User Phone</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Days Remaining</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="border p-2">{sub.id}</td>
                <td className="border p-2">{sub.user.phone}</td>
                <td className="border p-2">
                  {new Date(sub.startDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(sub.endDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {calculateRemainingDays(sub.endDate)} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
