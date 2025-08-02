// src/components/admindash/ServicesManagement.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { FaCog, FaPlus, FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import NewServiceForm from './NewServiceForm';
import ServiceCard from './ServiceCards';

interface Service {
  _id: string;
  id?: number;
  serviceName: string;
  description: string;
  pricing: number;
  deliveryTime: string;
  citiesCovered: string[];
  serviceImgs: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/services');
      if (Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch services:', err);
      setError(err.response?.data?.message || 'Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceUpdated = () => {
    fetchServices();
    setShowForm(false);
  };

  const handleRefresh = () => {
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Get all unique cities for filter
  const allCities = Array.from(
    new Set(services.flatMap(service => service.citiesCovered))
  ).sort();

  // Filter services based on search and city
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = filterCity === 'all' || service.citiesCovered.includes(filterCity);
    
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <section className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-blue-600 text-3xl mr-3" />
          <span className="text-lg text-gray-600">Loading services...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white shadow-lg rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaCog className="mr-3 text-blue-600" />
            Services Management
          </h2>
          <p className="text-gray-600 mt-1">Total: {services.length} services</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <FaSpinner className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            {showForm ? 'Cancel' : 'Add Service'}
          </button>
        </div>
      </div>

      {/* Add Service Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Service</h3>
          <NewServiceForm onSuccess={async () => await handleServiceUpdated()} />
        </div>
      )}

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaSearch className="inline mr-2" />
            Search Services
          </label>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by City
          </label>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Cities</option>
            {allCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Services</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <FaCog className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm || filterCity !== 'all' ? 'No services match your filters' : 'No services found'}
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterCity !== 'all' 
              ? 'Try adjusting your search criteria'
              : 'Services will appear here once they are created'
            }
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2 inline" />
              Add First Service
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard 
              key={service._id} 
              service={service} 
              onUpdated={fetchServices} 
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredServices.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
            <p>
              Showing {filteredServices.length} of {services.length} services
              {(searchTerm || filterCity !== 'all') && ' (filtered)'}
            </p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span>Total Revenue: {services.reduce((sum, s) => sum + s.pricing, 0)} MAD</span>
              <span>Avg Price: {Math.round(services.reduce((sum, s) => sum + s.pricing, 0) / services.length || 0)} MAD</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
