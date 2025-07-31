import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import UserCard from './UserCard';

export interface RegistrationRequest {
  id: number;
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

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/registration-requests/${id}/approve`);
      setRequests(reqs => reqs.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.post(`/registration-requests/${id}/reject`);
      setRequests(reqs => reqs.filter(r => r.id !== id));
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
              key={req.id}
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
