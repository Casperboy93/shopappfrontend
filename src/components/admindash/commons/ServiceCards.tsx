// src/components/admindash/ServiceCard.tsx
import { useState } from 'react';
import api from '../../../lib/axios';
import { FaEdit, FaTrash, FaSave, FaTimes, FaSpinner, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';

interface ServiceCardProps {
  service: {
    _id: string;
    serviceName: string;
    description: string;
    pricing: number;
    deliveryTime: string;
    citiesCovered: string[];
    serviceImgs: string[];
    createdAt?: string;
    updatedAt?: string;
  };
  onUpdated?: () => void;
}

interface EditFormData {
  serviceName: string;
  description: string;
  pricing: number;
  deliveryTime: string;
  citiesCovered: string[];
  serviceImgs: string[];
}

export default function ServiceCards({ service, onUpdated }: ServiceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    serviceName: service.serviceName,
    description: service.description,
    pricing: service.pricing,
    deliveryTime: service.deliveryTime,
    citiesCovered: service.citiesCovered,
    serviceImgs: service.serviceImgs
  });

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setEditFormData({
      serviceName: service.serviceName,
      description: service.description,
      pricing: service.pricing,
      deliveryTime: service.deliveryTime,
      citiesCovered: service.citiesCovered,
      serviceImgs: service.serviceImgs
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      setError(null);
      await api.patch(`/services/${service._id}`, editFormData);
      setIsEditing(false);
      onUpdated?.();
    } catch (err: any) {
      console.error('Failed to update service:', err);
      setError(err.response?.data?.message || 'Failed to update service');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${service.serviceName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/services/${service._id}`);
      onUpdated?.();
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      setError(err.response?.data?.message || 'Failed to delete service');
      setIsDeleting(false);
    }
  };

  const handleCitiesChange = (citiesString: string) => {
    const cities = citiesString.split(',').map(city => city.trim()).filter(city => city.length > 0);
    setEditFormData({ ...editFormData, citiesCovered: cities });
  };

  const handleImagesChange = (imagesString: string) => {
    const images = imagesString.split(',').map(img => img.trim()).filter(img => img.length > 0);
    setEditFormData({ ...editFormData, serviceImgs: images });
  };

  if (isDeleting) {
    return (
      <div className="border border-gray-200 rounded-lg shadow-md bg-white p-6 flex items-center justify-center">
        <FaSpinner className="animate-spin text-red-600 text-2xl mr-3" />
        <span className="text-gray-600">Deleting service...</span>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Service Image */}
      {service.serviceImgs?.[0] && (
        <div className="relative">
          <img
            src={service.serviceImgs[0]}
            alt={service.serviceName}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
              title="Edit Service"
            >
              <FaEdit className="text-sm" />
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
              title="Delete Service"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        {isEditing ? (
          /* Edit Form */
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                value={editFormData.serviceName}
                onChange={(e) => setEditFormData({ ...editFormData, serviceName: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (MAD)</label>
                <input
                  type="number"
                  value={editFormData.pricing}
                  onChange={(e) => setEditFormData({ ...editFormData, pricing: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                <input
                  type="text"
                  value={editFormData.deliveryTime}
                  onChange={(e) => setEditFormData({ ...editFormData, deliveryTime: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cities (comma-separated)</label>
              <input
                type="text"
                value={editFormData.citiesCovered.join(', ')}
                onChange={(e) => handleCitiesChange(e.target.value)}
                placeholder="Casablanca, Rabat, Marrakech"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
              <input
                type="text"
                value={editFormData.serviceImgs.join(', ')}
                onChange={(e) => handleImagesChange(e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                disabled={updateLoading}
              >
                <FaTimes className="mr-1 inline" />
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {updateLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Display Mode */
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-blue-700 flex-1">{service.serviceName}</h3>
              <div className="flex items-center gap-2 ml-3">
                <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                  <FaTag className="mr-1" />
                  {service.pricing} MAD
                </span>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">{service.description}</p>

            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-blue-500" />
              <span className="font-medium">Delivery: {service.deliveryTime}</span>
            </div>

            <div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                <span className="font-medium">Cities Covered:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.citiesCovered?.map((city, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons for non-image cards */}
            {!service.serviceImgs?.[0] && (
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={handleEdit}
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm"
                >
                  <FaEdit className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 transition-colors flex items-center text-sm"
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </div>
            )}

            {/* Timestamps */}
            {service.createdAt && (
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                Created: {new Date(service.createdAt).toLocaleDateString()}
                {service.updatedAt && service.updatedAt !== service.createdAt && (
                  <span className="ml-3">
                    Updated: {new Date(service.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
