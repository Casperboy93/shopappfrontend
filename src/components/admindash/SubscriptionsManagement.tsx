// src/components/admindash/SubscriptionsManagement.tsx
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
  const [duration, setDuration] = useState(30); // default duration
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
    return Math.max(diff, 0);
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userRes = await api.get(`/users/by-phone/${userPhone}`);
      const userId = userRes.data?.id;

      const startDate = new Date().toISOString();
      const endDate = dayjs().add(duration, 'day').toISOString();

      await api.post('/subscriptions', { userId, startDate, endDate });

      setSuccess('✅ Subscription added successfully!');
      setUserPhone('');
      setDuration(30);
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error adding subscription:', err);
      setError(err.response?.data?.message || '❌ Failed to add subscription');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📅 Subscriptions Management</h2>

      {/* Add Subscription */}
      <form onSubmit={handleAddSubscription} className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">User Phone</label>
            <input
              type="text"
              placeholder="e.g. +2126..."
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
              className="border rounded px-3 py-2 w-56"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
              min={1}
              className="border rounded px-3 py-2 w-32"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Subscription
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
      </form>

      {/* Subscriptions Table */}
      {subscriptions.length === 0 ? (
        <p className="text-gray-600 text-sm">No subscriptions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">User Phone</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">End Date</th>
                <th className="border px-4 py-2">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="text-center">
                  <td className="border px-4 py-2">{sub.id}</td>
                  <td className="border px-4 py-2">{sub.user.phone}</td>
                  <td className="border px-4 py-2">
                    {dayjs(sub.startDate).format('DD/MM/YYYY')}
                  </td>
                  <td className="border px-4 py-2">
                    {dayjs(sub.endDate).format('DD/MM/YYYY')}
                  </td>
                  <td className="border px-4 py-2 font-semibold text-blue-600">
                    {calculateRemainingDays(sub.endDate)} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
