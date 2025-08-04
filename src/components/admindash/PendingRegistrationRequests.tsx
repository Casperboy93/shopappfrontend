import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import UserCard from './commons/UserCard';
import RequestCard from './commons/RequestCard';

export interface RegistrationRequest {
  _id: string;
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
  status: string;
}

export default function PendingRegistrationRequests() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/registration-requests')
      .then(res => {
        const pending = res.data.filter((r: any) => r.status === 'pending');
        setRequests(pending);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/registration-requests/${id}/approve`);
      setRequests(reqs => reqs.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/registration-requests/${id}/reject`);
      setRequests(reqs => reqs.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <section className="p-4 lg:p-6 bg-white shadow-md rounded-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 lg:p-6 bg-white shadow-md rounded-xl">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
          Pending Registration Requests
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {requests.length} pending request{requests.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 lg:py-12">
          <p className="text-gray-500 italic text-lg">No pending requests.</p>
        </div>
      ) : (
        <div className="space-y-4 lg:space-y-6">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
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
