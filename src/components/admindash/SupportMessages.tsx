// src/components/admindash/SupportMessages.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';

interface SupportMessage {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function SupportMessages() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/support')
      .then(res => setMessages(res.data))
      .catch(err => {
        setError('Failed to load support messages');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Support Messages</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-600">No support messages.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="border border-gray-200 rounded p-3"
            >
              <div className="font-medium">{msg.title}</div>
              <div className="text-sm text-gray-600 mb-2">
                From: {msg.fullName} ({msg.email}) {msg.phone && `| 📞 ${msg.phone}`}
              </div>
              <div className="text-gray-700 whitespace-pre-wrap">{msg.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                Submitted: {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
