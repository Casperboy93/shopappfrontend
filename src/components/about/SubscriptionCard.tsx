import { FaUserFriends, FaRocket, FaStar, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

export default function SubscriptionCard() {
  const { t } = useTranslation();
  
  // WhatsApp function to handle subscription
  const handleWhatsAppSubscription = (planTitle: string, planPrice: string) => {
    const phoneNumber = "+212675927607"; // Replace with your actual WhatsApp business number
    const message = `Hello! I'm interested in subscribing to the ${planTitle} plan for ${planPrice}. Could you please provide more information about the subscription process?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const plans = [
    {
      tag: t('subscriptionCard.plans.starter.tag'),
      title: t('subscriptionCard.plans.starter.title'),
      description: t('subscriptionCard.plans.starter.description'),
      price: "100 DH",
      duration: t('subscriptionCard.plans.starter.duration'),
      benefits: [
        t('subscriptionCard.plans.starter.benefits.0'),
        t('subscriptionCard.plans.starter.benefits.1'),
        t('subscriptionCard.plans.starter.benefits.2'),
      ],
      icon: <FaRocket />,
    },
    {
      tag: t('subscriptionCard.plans.professional.tag'),
      title: t('subscriptionCard.plans.professional.title'),
      description: t('subscriptionCard.plans.professional.description'),
      price: "200 DH",
      duration: t('subscriptionCard.plans.professional.duration'),
      benefits: [
        t('subscriptionCard.plans.professional.benefits.0'),
        t('subscriptionCard.plans.professional.benefits.1'),
        t('subscriptionCard.plans.professional.benefits.2'),
      ],
      icon: <FaUserFriends />,
    },
    {
      tag: t('subscriptionCard.plans.premium.tag'),
      title: t('subscriptionCard.plans.premium.title'),
      description: t('subscriptionCard.plans.premium.description'),
      price: "500 DH",
      duration: t('subscriptionCard.plans.premium.duration'),
      benefits: [
        t('subscriptionCard.plans.premium.benefits.0'),
        t('subscriptionCard.plans.premium.benefits.1'),
        t('subscriptionCard.plans.premium.benefits.2'),
      ],
      icon: <FaStar />,
    },
  ];

  return (
    <div className="max-w-6xl mt-10 mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="text-gradient-golden">{t('subscriptionCard.chooseTitle')}</span>{" "}
        <span className="text-white">{t('subscriptionCard.yourPlan')}</span>
      </h2>
      
      {/* Enhanced Description Section */}
      <div className="text-center mb-10">
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed mb-4">
          {t('subscriptionCard.description')}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-golden-400 rounded-full"></span>
            <span>{t('subscriptionCard.features.flexible')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-custom-400 rounded-full"></span>
            <span>{t('subscriptionCard.features.noHiddenFees')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-golden-400 rounded-full"></span>
            <span>{t('subscriptionCard.features.cancelAnytime')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="bg-card-dark rounded-xl p-5 shadow-lg relative overflow-hidden border border-golden-600/30"
          >
            {/* Tag */}
            <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
              {plan.tag}
            </div>

            {/* Icon */}
            <div className="flex justify-center text-golden-400 text-4xl mb-3">
              {plan.icon}
            </div>

            {/* Title */}
            <h3 className="text-white text-lg font-bold text-center mb-2">
              {plan.title}
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-sm text-center mb-4">
              {plan.description}
            </p>

            {/* Price */}
            <p className="text-white text-2xl font-bold text-center mb-2">
              {plan.price}
              <span className="text-sm font-medium"> {plan.duration}</span>
            </p>

            {/* Updated Button with WhatsApp functionality */}
            <button 
              onClick={() => handleWhatsAppSubscription(plan.title, plan.price)}
              className="bg-golden-600 hover:bg-golden-500 w-full py-2 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span><FaWhatsapp className="text-lg" /></span>
              {t('subscriptionCard.subscribe')}
            </button>

            {/* Divider */}
            <div className="border-t border-gray-700 my-4"></div>

            {/* Benefits */}
            <ul className="space-y-2 text-gray-300 text-sm">
              {plan.benefits.map((benefit, i) => (
                <li key={i}>✅ {benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
