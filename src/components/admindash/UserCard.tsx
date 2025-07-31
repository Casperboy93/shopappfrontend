import type { RegistrationRequest } from './PendingRegistrationRequests';

interface UserCardProps {
  request: RegistrationRequest;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function UserCard({ request, onApprove, onReject }: UserCardProps) {
  const {
    id,
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
    <div className="bg-white rounded-xl shadow-md p-6 flex gap-6 items-start border hover:shadow-lg transition">
      <img
        src={profileImg || '/placeholder.jpg'}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{firstName} {lastName}</h3>
          <span className="text-sm text-gray-600 italic">{job} — {city}</span>
        </div>
        <div className="text-sm text-gray-700 mt-2 space-y-1">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>DOB:</strong> {dob}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Portfolio:</strong> <a href={portfolio} target="_blank" className="text-blue-600 underline">{portfolio}</a></p>
          <p><strong>Description:</strong> {description}</p>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onApprove(id)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
