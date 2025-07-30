// src/components/admindash/ServicesManagement.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import NewServiceForm from './NewServiceForm';
import ServiceCard from './ServiceCards';

export default function ServicesManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:3000/services');
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="space-y-6">
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {showForm ? 'Hide Form' : '➕ Add New Service'}
      </button>

      {showForm && <NewServiceForm onSuccess={fetchServices} />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="text-gray-600 col-span-2">No services available.</p>
        ) : (
          services.map((srv) => <ServiceCard key={srv.id} service={srv} />)
        )}
      </div>
    </section>
  );
}
