// src/components/admindash/SupportMessages.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import MessageCard from './commons/MessageCard';
import { FaSearch, FaFilter, FaSync, FaInbox } from 'react-icons/fa';

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
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
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
    setCurrentPage(1);
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      await api.patch(`/support/${messageId}`, { status: newStatus });
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: newStatus as any } : msg
      ));
    } catch (err) {
      console.error('Failed to update message status:', err);
      throw new Error('Failed to update message status');
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

  const handleToggleExpand = (messageId: string) => {
    setExpandedMessage(prev => prev === messageId ? null : messageId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + messagesPerPage);

  return (
    <section className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaInbox className="text-blue-600" />
            Support Messages
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and respond to customer support requests
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <span className="font-medium">Total:</span>
          <span className="text-blue-600 font-semibold">{filteredMessages.length}</span>
          <span>messages</span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, title, or message content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <button
              onClick={fetchMessages}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <FaSync className="text-sm" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading messages...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <FaInbox className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No support messages found</p>
          {searchTerm || statusFilter !== 'all' ? (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Clear filters to see all messages
            </button>
          ) : (
            <p className="text-gray-400 text-sm">Messages will appear here when customers contact support</p>
          )}
        </div>
      ) : (
        <>
          {/* Messages List */}
          <div className="space-y-4">
            {paginatedMessages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                isExpanded={expandedMessage === message._id}
                onToggleExpand={() => handleToggleExpand(message._id)}
                onUpdateStatus={updateMessageStatus}
                onDelete={(id) => setShowDeleteConfirm(id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this support message? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMessage(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
