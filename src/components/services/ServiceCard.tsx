import { useState } from 'react';

interface ServiceCardProps {
  service: {
    serviceName: string;
    pricing: number;
    description: string;
    createdAt: string;
    serviceImgs: string[];
    deliveryTime: string;
    citiesCovered: string[];
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [showDescription, setShowDescription] = useState(false);

  const createdDate = new Date(service.createdAt);
  const today = new Date();
  const diffTime = today.getTime() - createdDate.getTime();
  const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white/10 border border-white/20 backdrop-blur-lg shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:scale-[1.01] text-white">
      {/* Image */}
      <img
        src={service.serviceImgs[0]}
        alt={service.serviceName}
        className="w-full md:w-60 h-56 object-cover"
      />

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-1">{service.serviceName}</h3>

          <p className="text-xs text-white/60 mb-2">
            Created on {createdDate.toLocaleDateString()} — {daysSince} day{daysSince !== 1 ? 's' : ''} ago
          </p>

          <p
            className={`text-sm text-white/80 mb-3 transition-all duration-300 ease-in-out ${
              showDescription ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            {service.description}
          </p>

          <p className="text-sm">
            <strong>Delivery:</strong> {service.deliveryTime}
          </p>
          <p className="text-sm">
            <strong>Available in:</strong> {service.citiesCovered.join(', ')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-yellow-400 font-extrabold text-lg">
            {service.pricing.toFixed(2)} MAD
          </span>
          <button
            onClick={() => setShowDescription(prev => !prev)}
            className="bg-yellow-400 text-black px-5 py-2 rounded-lg hover:bg-white hover:text-yellow-500 transition font-semibold"
          >
            {showDescription ? 'Hide' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
