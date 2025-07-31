// src/components/admindash/ServicesManagement.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import NewServiceForm from './NewServiceForm';
import ServiceCard from './ServiceCards';

interface Service {
  id: number;
  serviceName: string;
  description: string;
  pricing: number;
  deliveryTime: string;
  citiesCovered: string[];
  serviceImgs: string[];
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      if (Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="p-6 bg-white rounded-lg shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">🛠 Services Management</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? 'Hide Form' : '➕ Add New Service'}
        </button>
      </div>

      {showForm && (
        <div className="border p-4 rounded bg-gray-50">
          <NewServiceForm onSuccess={fetchServices} />
        </div>
      )}

      {services.length === 0 ? (
        <p className="text-gray-600">No services available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <ServiceCard key={srv.id} service={srv} onUpdated={fetchServices} />
          ))}
        </div>
      )}
    </section>
  );
}
