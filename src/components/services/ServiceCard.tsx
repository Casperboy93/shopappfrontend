import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [showDescription, setShowDescription] = useState(false);

  const createdDate = new Date(service.createdAt);
  const today = new Date();
  const diffTime = today.getTime() - createdDate.getTime();
  const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-card-dark rounded-xl flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:scale-[1.01] text-white shadow-xl hover:shadow-golden-500/10">
      {/* Image */}
      <img
        src={service.serviceImgs[0]}
        alt={service.serviceName}
        className="w-full md:w-60 h-56 object-cover"
      />

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-1 text-gradient-golden">{service.serviceName}</h3>

          <p className="text-xs text-gray-400 mb-2">
            {t('serviceCard.createdOn')} {createdDate.toLocaleDateString()} — {daysSince} {daysSince !== 1 ? t('serviceCard.days') : t('serviceCard.day')} {t('serviceCard.ago')}
          </p>

          <p
            className={`text-sm text-gray-300 mb-3 transition-all duration-300 ease-in-out ${
              showDescription ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            {service.description}
          </p>

          <p className="text-sm text-high-contrast">
            <strong className="text-emerald-bright">{t('serviceCard.delivery')}</strong> {service.deliveryTime}
          </p>
          <p className="text-sm text-high-contrast">
            <strong className="text-emerald-bright">{t('serviceCard.availableIn')}</strong> {service.citiesCovered.join(', ')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-gradient-golden font-extrabold text-lg">
            {service.pricing.toFixed(2)} MAD
          </span>
          <button
            onClick={() => setShowDescription(prev => !prev)}
            className="btn-emerald-enhanced px-5 py-2 rounded-lg transition-all duration-200 font-semibold"
          >
            {showDescription ? t('serviceCard.hide') : t('serviceCard.bookNow')}
          </button>
        </div>
      </div>
    </div>
  );
}
