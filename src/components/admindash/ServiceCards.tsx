// src/components/admindash/ServiceCard.tsx

interface ServiceCardProps {
  service: {
    id: number;
    serviceName: string;
    description: string;
    pricing: number;
    deliveryTime: string;
    citiesCovered: string[];
    serviceImgs: string[];
  };
  onUpdated?: () => void; // <- add this line
}

export default function ServiceCards({ service }: ServiceCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300 overflow-hidden">
      {service.serviceImgs?.[0] && (
        <img
          src={service.serviceImgs[0]}
          alt={service.serviceName}
          className="w-full h-36 object-cover"
        />
      )}

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-700">{service.serviceName}</h3>
          <span className="text-sm font-semibold text-green-600">
            {service.pricing} MAD
          </span>
        </div>

        <p className="text-gray-700 text-sm">{service.description}</p>

        <p className="text-xs font-medium text-gray-500">
          Delivery: {service.deliveryTime}
        </p>

        <div className="flex flex-wrap gap-2">
          {service.citiesCovered?.map((city, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
