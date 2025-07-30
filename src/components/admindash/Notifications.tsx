// src/components/admindash/Notifications.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { Loader2, Bell } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(res => {
        const unique = res.data.filter(
          (v: Notification, i: number, a: Notification[]) =>
            a.findIndex(t => t.id === v.id) === i
        );
        setNotifications(unique);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = (id: number) => {
    api.delete(`/notifications/${id}`)
      .then(() => setNotifications((notes) => notes.filter((n) => n.id !== id)))
      .catch(console.error);
  };

  return (
    <section className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 flex items-center justify-center py-8">
          <Loader2 className="animate-spin mr-2" /> Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-6">You’re all caught up! 🎉</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note) => (
            <li
              key={note.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:shadow-sm transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{note.message}</p>
                <time className="block text-xs text-gray-400 mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </time>
              </div>
              <button
                onClick={() => markAsRead(note.id)}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Mark as read
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
