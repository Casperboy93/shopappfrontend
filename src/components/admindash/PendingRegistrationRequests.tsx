import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import UserCard from './UserCard';

export interface RegistrationRequest {
  _id: string; // Changed from 'id: number' to '_id: string'
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  address: string;
  profileImg: string;
  portfolio: string;
  job: string;
  description: string;
  status: string; // Add status field
}

export default function PendingRegistrationRequests() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);

  useEffect(() => {
    api.get('/registration-requests')
      .then(res => {
        const pending = res.data.filter((r: any) => r.status === 'pending');
        setRequests(pending);
      })
      .catch(console.error);
  }, []);

  const handleApprove = async (id: string) => { // Changed parameter type to string
    try {
      await api.post(`/registration-requests/${id}/approve`);
      setRequests(reqs => reqs.filter(r => r._id !== id)); // Use _id instead of id
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => { // Changed parameter type to string
    try {
      await api.post(`/registration-requests/${id}/reject`);
      setRequests(reqs => reqs.filter(r => r._id !== id)); // Use _id instead of id
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Pending Registration Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500 italic">No pending requests.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <UserCard
              key={req._id} // Fixed: Use _id as key and ensure it exists
              request={req}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </section>
  );
}
