import { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceCard from '../components/services/ServiceCard';
import { MOROCCAN_CITIES } from '../consts/cities';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);

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

  const filteredServices = services.filter(service => {
    const matchesCity = !selectedCity || service.citiesCovered?.includes(selectedCity);
    const matchesName = service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = service.pricing >= minPrice && service.pricing <= maxPrice;
    return matchesCity && matchesName && matchesPrice;
  });

  return (
    <div className="bg-black min-h-screen py-6 text-white">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-2">
          Browse Our Services
        </h1>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 grid md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium text-white mb-1">Search by name</label>
            <input
              type="text"
              placeholder="e.g., Cleaning"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-white/50 focus:outline-none focus:border-yellow-400 px-2 py-1 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <label className="block font-medium text-white mb-1">Filter by City</label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full bg-black border border-white/30 rounded px-3 py-2 text-white"
            >
              <option value="">All Cities</option>
              {MOROCCAN_CITIES.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-white mb-1">Pricing (MAD)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(Number(e.target.value))}
                className="w-20 bg-transparent border border-white/30 text-white px-2 py-1 rounded"
                min={0}
              />
              <span>—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-20 bg-transparent border border-white/30 text-white px-2 py-1 rounded"
              />
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <p className="text-center text-white/70">No services found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
