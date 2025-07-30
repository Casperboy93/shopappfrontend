import { useState } from 'react';
import axios from 'axios';

type NewServiceFormProps = {
  onSuccess: () => Promise<void>;
};

export default function NewServiceForm({ onSuccess }: NewServiceFormProps) {
  const [formData, setFormData] = useState({
    serviceName: '',
    pricing: '',
    description: '',
    serviceImgs: '',
    deliveryTime: '',
    citiesCovered: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/services', {
        serviceName: formData.serviceName,
        pricing: parseFloat(formData.pricing),
        description: formData.description,
        serviceImgs: formData.serviceImgs.split(',').map((s) => s.trim()),
        deliveryTime: formData.deliveryTime,
        citiesCovered: formData.citiesCovered.split(',').map((c) => c.trim()),
      });
      setFormData({
        serviceName: '',
        pricing: '',
        description: '',
        serviceImgs: '',
        deliveryTime: '',
        citiesCovered: '',
      });
      await onSuccess();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm space-y-4">
      <input
        type="text"
        name="serviceName"
        value={formData.serviceName}
        onChange={handleChange}
        placeholder="Service name"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="number"
        name="pricing"
        value={formData.pricing}
        onChange={handleChange}
        placeholder="Pricing (€)"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Service description"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="serviceImgs"
        value={formData.serviceImgs}
        onChange={handleChange}
        placeholder="Image URLs (comma separated)"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="deliveryTime"
        value={formData.deliveryTime}
        onChange={handleChange}
        placeholder="Delivery time (e.g. 2-3 days)"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        name="citiesCovered"
        value={formData.citiesCovered}
        onChange={handleChange}
        placeholder="Cities Covered (comma separated)"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        ➕ Add Service
      </button>
    </form>
  );
}
