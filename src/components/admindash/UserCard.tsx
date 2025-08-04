import type { RegistrationRequest } from './PendingRegistrationRequests';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaExternalLinkAlt, FaCheck, FaTimes } from 'react-icons/fa';

interface UserCardProps {
  request: RegistrationRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function UserCard({ request, onApprove, onReject }: UserCardProps) {
  const {
    _id,
    firstName,
    lastName,
    email,
    phone,
    dob,
    city,
    address,
    profileImg,
    portfolio,
    job,
    description,
  } = request;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 hover:border-golden-500/30 transition-all duration-500 overflow-hidden group">
      {/* Header with gradient overlay */}
      <div className="relative bg-gradient-to-r from-golden-500/10 to-emerald-500/10 p-6 border-b border-slate-700/50">
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-3 border-golden-500/30 shadow-xl group-hover:border-golden-500/50 transition-all duration-300">
              <img
                src={profileImg || '/placeholder.jpg'}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <FaUser className="text-white text-xs" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-golden-300 transition-colors duration-300">
                  {firstName} {lastName}
                </h3>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <FaBriefcase className="text-sm" />
                  <span>{job}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FaMapMarkerAlt className="text-golden-400" />
                <span className="font-medium">{city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <FaEnvelope className="text-golden-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Email</p>
                <p className="text-white font-medium truncate">{email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <FaPhone className="text-emerald-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Phone</p>
                <p className="text-white font-medium">{phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <FaCalendarAlt className="text-blue-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Date of Birth</p>
                <p className="text-white font-medium">{formatDate(dob)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <FaMapMarkerAlt className="text-red-400 flex-shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Address</p>
                <p className="text-white font-medium leading-relaxed">{address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        {portfolio && (
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-3">
              <FaExternalLinkAlt className="text-purple-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Portfolio</p>
                <a 
                  href={portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 font-medium underline decoration-purple-500/50 hover:decoration-purple-300 transition-all duration-200 break-all"
                >
                  {portfolio}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">Description</p>
          <p className="text-slate-200 leading-relaxed">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => onApprove(_id)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-200 group/btn"
          >
            <FaCheck className="group-hover/btn:scale-110 transition-transform duration-200" />
            <span>Approve Request</span>
          </button>
          
          <button
            onClick={() => onReject(_id)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02] transition-all duration-200 group/btn"
          >
            <FaTimes className="group-hover/btn:scale-110 transition-transform duration-200" />
            <span>Reject Request</span>
          </button>
        </div>
      </div>
    </div>
  );
}
