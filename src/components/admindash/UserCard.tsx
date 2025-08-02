import type { RegistrationRequest } from './PendingRegistrationRequests';

interface UserCardProps {
  request: RegistrationRequest;
  onApprove: (id: string) => void; // Changed from number to string
  onReject: (id: string) => void;  // Changed from number to string
}

export default function UserCard({ request, onApprove, onReject }: UserCardProps) {
  const {
    _id, // Changed from 'id' to '_id'
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
    <div className="bg-card-dark rounded-xl shadow-2xl p-6 flex gap-6 items-start hover:shadow-golden-500/10 transition-all duration-300">
      <img
        src={profileImg || '/placeholder.jpg'}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-2 border-golden-500/30"
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
          <p><strong className="text-golden-bright">Portfolio:</strong> <a href={portfolio} target="_blank" className="text-emerald-bright underline hover:text-emerald-300 transition-colors">{portfolio}</a></p>
          <p><strong className="text-golden-bright">Description:</strong> {description}</p>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onApprove(_id)} // Changed from 'id' to '_id'
            className="btn-emerald-enhanced px-4 py-2 rounded-lg transition-all duration-200"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(_id)} // Changed from 'id' to '_id'
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
