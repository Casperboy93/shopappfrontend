import type { RegistrationRequest } from './PendingRegistrationRequests';

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

  return (
    <div className="bg-card-dark rounded-xl shadow-2xl p-4 lg:p-6 hover:shadow-golden-500/10 transition-all duration-300">
      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={profileImg || '/placeholder.jpg'}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-golden-500/30 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-high-contrast truncate">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-emerald-bright">{job}</p>
            <p className="text-sm text-gray-300">{city}</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><strong className="text-golden-bright">Email:</strong> <span className="break-all">{email}</span></p>
            <p><strong className="text-golden-bright">Phone:</strong> {phone}</p>
            <p><strong className="text-golden-bright">DOB:</strong> {dob}</p>
            <p><strong className="text-golden-bright">Address:</strong> <span className="break-words">{address}</span></p>
          </div>
          <p><strong className="text-golden-bright">Portfolio:</strong> 
            <a href={portfolio} target="_blank" className="text-emerald-bright underline hover:text-emerald-300 transition-colors break-all ml-1">
              {portfolio}
            </a>
          </p>
          <p><strong className="text-golden-bright">Description:</strong> <span className="break-words">{description}</span></p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onApprove(_id)}
            className="btn-emerald-enhanced px-4 py-2 rounded-lg transition-all duration-200 text-center"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(_id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-center"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6 items-start">
        <img
          src={profileImg || '/placeholder.jpg'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-golden-500/30 flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-high-contrast">{firstName} {lastName}</h3>
            <span className="text-sm text-emerald-bright italic">{job} — {city}</span>
          </div>
          <div className="text-sm text-gray-300 mt-2 space-y-1">
            <p><strong className="text-golden-bright">Email:</strong> {email}</p>
            <p><strong className="text-golden-bright">Phone:</strong> {phone}</p>
            <p><strong className="text-golden-bright">DOB:</strong> {dob}</p>
            <p><strong className="text-golden-bright">Address:</strong> {address}</p>
            <p><strong className="text-golden-bright">Portfolio:</strong> 
              <a href={portfolio} target="_blank" className="text-emerald-bright underline hover:text-emerald-300 transition-colors ml-1">
                {portfolio}
              </a>
            </p>
            <p><strong className="text-golden-bright">Description:</strong> {description}</p>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => onApprove(_id)}
              className="btn-emerald-enhanced px-4 py-2 rounded-lg transition-all duration-200"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(_id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
