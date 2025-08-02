// src/components/admindash/SupportMessages.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';

interface SupportMessage {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  title: string;
  message: string;
  createdAt: string;
  status?: 'pending' | 'resolved' | 'in-progress';
}

export default function SupportMessages() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const messagesPerPage = 5;

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/support');
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError('❌ Failed to load support messages.');
      console.error('Support messages fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => (msg.status || 'pending') === statusFilter);
    }

    setFilteredMessages(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      await api.patch(`/support/${messageId}`, { status: newStatus });
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: newStatus as any } : msg
      ));
    } catch (err) {
      console.error('Failed to update message status:', err);
      alert('Failed to update message status');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await api.delete(`/support/${messageId}`);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);

  const getStatusColor = (status: string = 'pending') => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: string = 'pending') => {
    switch (status) {
      case 'resolved': return '✅';
      case 'in-progress': return '⏳';
      default: return '🔴';
    }
  };

  return (
    <section className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Support Messages</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredMessages.length} messages
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search messages by name, email, title, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">Loading messages...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchMessages}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">📭 No support messages found.</p>
          {searchTerm || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          {/* Messages List */}
          <div className="space-y-4">
            {paginatedMessages.map((msg) => (
              <div
                key={msg._id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{msg.title}</h3>
                    <div className="text-sm text-gray-600">
                      From: <span className="font-medium">{msg.fullName}</span> ({msg.email})
                      {msg.phone && (
                        <span className="ml-2">📞 {msg.phone}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                      {getStatusIcon(msg.status)} {(msg.status || 'pending').replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap mb-3 line-clamp-3">
                  {msg.message.length > 200 ? (
                    <>
                      {selectedMessage?._id === msg._id ? msg.message : `${msg.message.substring(0, 200)}...`}
                      <button
                        onClick={() => setSelectedMessage(selectedMessage?._id === msg._id ? null : msg)}
                        className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        {selectedMessage?._id === msg._id ? 'Show less' : 'Read more'}
                      </button>
                    </>
                  ) : (
                    msg.message
                  )}
                </p>

                <div className="flex justify-between items-center">
                  <time className="text-xs text-gray-400">
                    {new Intl.DateTimeFormat('en-GB', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(msg.createdAt))}
                  </time>
                  
                  <div className="flex gap-2">
                    {/* Status Update Buttons */}
                    {msg.status !== 'resolved' && (
                      <>
                        {msg.status !== 'in-progress' && (
                          <button
                            onClick={() => updateMessageStatus(msg._id, 'in-progress')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
                          >
                            Mark In Progress
                          </button>
                        )}
                        <button
                          onClick={() => updateMessageStatus(msg._id, 'resolved')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </>
                    )}
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => setShowDeleteConfirm(msg._id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ← Previous
              </button>
              
              <span className="px-4 py-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this support message? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMessage(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
