
const banks = [
  {
    name: "CIH Bank",
    time: "8 hours",
    img: "/banks/cih.png", // Put your image path here
  },
  {
    name: "Barid Bank",
    time: "12 hours",
    img: "/banks/barid.png",
  },
  {
    name: "Attijariwafa Bank",
    time: "19 hours",
    img: "/banks/attijari.png",
  },
  {
    name: "Banque Populaire",
    time: "24 hours",
    img: "/banks/populaire.png",
  },
];

export default function PaymentMethods() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-white text-2xl font-bold mb-6 text-center">
        Payment Methods
      </h2>
      
      {/* Enhanced Description Section */}
      <div className="text-center mb-8">
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
          We support multiple secure payment methods through trusted Moroccan banks. 
          Choose your preferred bank for fast and reliable subscription payments.
        </p>
        
        <div className="backdrop-blur bg-white/5 border border-golden-600/20 rounded-xl p-6 max-w-3xl mx-auto">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-golden-400 rounded-full"></span>
            Payment Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-emerald-custom-400">🔒</span>
              <span>Secure SSL encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-golden-400">⚡</span>
              <span>Fast processing times</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-custom-400">💳</span>
              <span>Multiple bank support</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-golden-400">📱</span>
              <span>Mobile-friendly payments</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {banks.map((bank, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform border border-gray-700/50 hover:border-golden-600/30"
          >
            <img
              src={bank.img}
              alt={bank.name}
              className="w-24 h-24 object-contain rounded-full border border-gray-700 mb-4"
            />
            <h3 className="text-white text-lg font-semibold">{bank.name}</h3>
            <p className="text-gray-400 text-sm">Validation: {bank.time}</p>
            <div className="mt-3 px-3 py-1 bg-golden-600/20 rounded-full">
              <span className="text-golden-400 text-xs font-medium">Available</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional Info Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Processing times may vary depending on your bank's verification procedures. 
          All transactions are secured and monitored for your protection.
        </p>
      </div>
    </div>
  );
}
