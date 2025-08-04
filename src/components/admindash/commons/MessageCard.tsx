import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaClock, FaEye, FaEyeSlash, FaCheck, FaSpinner, FaTrash } from 'react-icons/fa';

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

interface MessageCardProps {
  message: SupportMessage;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (messageId: string, newStatus: string) => Promise<void>;
  onDelete: (messageId: string) => void;
}

export default function MessageCard({ 
  message, 
  isExpanded, 
  onToggleExpand, 
  onUpdateStatus, 
  onDelete 
}: MessageCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusConfig = (status: string = 'pending') => {
    switch (status) {
      case 'resolved':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '✅',
          label: 'RESOLVED'
        };
      case 'in-progress':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: '⏳',
          label: 'IN PROGRESS'
        };
      default:
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '🔴',
          label: 'PENDING'
        };
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(message._id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  const statusConfig = getStatusConfig(message.status);
  const shouldTruncate = message.message.length > 200;
  const displayMessage = shouldTruncate && !isExpanded 
    ? `${message.message.substring(0, 200)}...` 
    : message.message;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {message.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-400 flex-shrink-0" />
                <span className="font-medium">{message.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{message.email}</span>
              </div>
              {message.phone && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-400 flex-shrink-0" />
                  <span>{message.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {displayMessage}
          </p>
          {shouldTruncate && (
            <button
              onClick={onToggleExpand}
              className="mt-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  <FaEyeSlash className="text-xs" />
                  Show less
                </>
              ) : (
                <>
                  <FaEye className="text-xs" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaClock className="text-gray-400" />
            <time>{formatDate(message.createdAt)}</time>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Update Buttons */}
            {message.status !== 'resolved' && (
              <>
                {message.status !== 'in-progress' && (
                  <button
                    onClick={() => handleStatusUpdate('in-progress')}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    {isUpdating ? <FaSpinner className="animate-spin" /> : '⏳'}
                    In Progress
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate('resolved')}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {isUpdating ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  Resolve
                </button>
              </>
            )}
            
            {/* Delete Button */}
            <button
              onClick={() => onDelete(message._id)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}