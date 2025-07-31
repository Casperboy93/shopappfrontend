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
      .then(res => {
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          throw new Error('Unexpected response format');
        }
      })
      .catch(err => {
        setError('❌ Failed to load support messages.');
        console.error('Support messages fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Support Messages</h2>

      {loading ? (
        <p className="text-gray-500">⏳ Loading messages...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">✅ No support messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800">{msg.title}</h3>
              <div className="text-sm text-gray-600 mt-1 mb-2">
                From: <span className="font-medium">{msg.fullName}</span> ({msg.email})
                {msg.phone && ` | 📞 ${msg.phone}`}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
              <time className="block text-xs text-gray-400 mt-2">
                {new Intl.DateTimeFormat('en-GB', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(msg.createdAt))}
              </time>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
