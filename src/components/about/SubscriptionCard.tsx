import { FaUserFriends, FaRocket, FaStar } from "react-icons/fa";

export default function SubscriptionCard() {
  const plans = [
    {
      tag: "Starter Pack",
      title: "Basic Subscription",
      description: "Start getting small jobs and build your first reviews.",
      price: "100 DH",
      duration: "/1 mois",
      benefits: [
        "1 month of subscription",
        "Access to basic jobs",
        "1 annonce /semaine",
      ],
      icon: <FaRocket />,
    },
    {
      tag: "Launch Pack",
      title: "Professional Subscription",
      description: "Take over more jobs and make your reputation fast.",
      price: "200 DH",
      duration: "/3 mois",
      benefits: [
        "3 months of subscription",
        "1 service VIP",
        "Featured placement on homepage",
      ],
      icon: <FaUserFriends />,
    },
    {
      tag: "Elite Pack",
      title: "Premium Subscription",
      description: "Dominate search results and get premium job offers.",
      price: "400 DH",
      duration: "/8 mois",
      benefits: [
        "8 months of subscription",
        "Unlimited annonces",
        "Priority job alerts",
      ],
      icon: <FaStar />,
    },
  ];

  return (
    <div className="max-w-6xl mt-10 mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="text-gradient-golden">Choose</span>{" "}
        <span className="text-white">Your Plan</span>
      </h2>
      
      {/* Enhanced Description Section */}
      <div className="text-center mb-10">
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed mb-4">
          Select the perfect subscription plan that matches your professional goals and budget. 
          Each plan is designed to help you grow your business and connect with more clients.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-golden-400 rounded-full"></span>
            <span>Flexible monthly plans</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-custom-400 rounded-full"></span>
            <span>No hidden fees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-golden-400 rounded-full"></span>
            <span>Cancel anytime</span>
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

            {/* Button */}
            <button className="bg-golden-600 hover:bg-golden-500 w-full py-2 rounded-lg text-white font-semibold transition-colors">
              Subscribe
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
