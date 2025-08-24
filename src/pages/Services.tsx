// src/pages/Services.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../lib/axios";
import ServiceCard from "../components/services/ServiceCard";
import { MOROCCAN_CITIES } from "../consts/cities";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/services");
      const data = res.data;
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        console.error("Expected array but got:", data);
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesCity =
      !selectedCity || 
      service.citiesCovered?.includes(selectedCity) ||
      service.citiesCovered?.includes(t(selectedCity));
    const matchesName = service.serviceName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      service.pricing >= minPrice && service.pricing <= maxPrice;
    return matchesCity && matchesName && matchesPrice;
  });

  const clearFilters = () => {
    setSelectedCity("");
    setSearchTerm("");
    setMinPrice(0);
    setMaxPrice(2000);
  };

  return (
    <div className="bg-gradient-dark min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-golden-500/10 via-transparent to-emerald-custom-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className=" bg-clip-text text-cyan-600 ">
              {t("services.discoverServices")}
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("services.findPerfectService")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Enhanced Filters Section */}
        <div className="mb-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <FaFilter className="text-golden-400" />
              {t("services.filterServices")}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden btn-golden-enhanced px-4 py-2 rounded-lg text-sm"
              >
                {showFilters
                  ? t("services.hideFilters")
                  : t("services.showFilters")}
              </button>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white transition-colors underline"
              >
                {t("services.clearAll")}
              </button>
            </div>
          </div>

          <div
            className={`bg-card-dark rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              showFilters || "max-md:hidden"
            }`}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="font-medium text-high-contrast flex items-center gap-2">
                  <FaSearch className="text-golden-400" />
                  {t("services.searchServices")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("services.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-800 border border-golden-600/30 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-gray-400 focus:outline-none focus:border-golden-400 focus:ring-2 focus:ring-golden-400/20 transition-all duration-200"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="font-medium text-high-contrast flex items-center gap-2">
                  <FaMapMarkerAlt className="text-emerald-custom-400" />
                  {t("services.location")}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-dark-800 border border-golden-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-custom-400 focus:ring-2 focus:ring-emerald-custom-400/20 transition-all duration-200"
                >
                  <option value="">{t("services.allCities")}</option>
                  {MOROCCAN_CITIES.map((cityKey) => (
                    <option key={cityKey} value={cityKey}>
                      {t(cityKey)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="font-medium text-high-contrast flex items-center gap-2">
                  <FaMoneyBillWave className="text-golden-400" />
                  {t("services.priceRangeLabel")}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full bg-dark-800 border border-golden-600/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-golden-400 transition-colors"
                      min={0}
                      placeholder={t("services.min")}
                    />
                  </div>
                  <span className="text-gray-400 font-medium">
                    {t("services.to")}
                  </span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full bg-dark-800 border border-golden-600/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-golden-400 transition-colors"
                      placeholder={t("services.max")}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t("services.priceRangeDisplay", {
                    min: minPrice,
                    max: maxPrice,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-4xl text-golden-400 animate-spin mb-4" />
            <p className="text-gray-300 text-lg">
              {t("services.loadingServices")}
            </p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            {/* <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {filteredServices.length > 0 ? (
                  <>
                    {t("services.showingResults", {
                      count: filteredServices.length,
                      plural: filteredServices.length !== 1 ? "s" : "",
                    })}
                    {(searchTerm || selectedCity) && (
                      <span className="text-gray-400 text-base font-normal ml-2">
                        {searchTerm &&
                          t("services.searchFor", { term: searchTerm })}
                        {searchTerm && selectedCity && " "}
                        {selectedCity &&
                          t("services.inCity", { city: selectedCity })}
                      </span>
                    )}
                  </>
                ) : (
                  t("services.noServicesFound")
                )}
              </h3>
            </div> */}

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="group relative text-center cursor-pointer">
                {/* Glassmorphism container */}
                <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out transform group-hover:scale-110 group-hover:bg-white/10 group-hover:border-golden-400/30 group-hover:shadow-2xl group-hover:shadow-golden-400/20">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-golden-400/20 via-transparent to-golden-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute w-2 h-2 bg-golden-400/40 rounded-full animate-pulse top-4 right-4 group-hover:animate-bounce"></div>
                    <div className="absolute w-1 h-1 bg-golden-300/60 rounded-full animate-pulse bottom-6 left-6 group-hover:animate-ping"></div>
                    <div className="absolute w-1.5 h-1.5 bg-golden-500/50 rounded-full animate-pulse top-8 left-8 group-hover:animate-bounce delay-100"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-3xl font-bold text-golden-400 mb-2 transition-all duration-300 group-hover:text-golden-300 group-hover:scale-110 group-hover:drop-shadow-lg">
                      <span className="inline-block transition-transform duration-300 group-hover:rotate-12">
                        {services.length}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                      {t("services.servicesAvailable")}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-golden-400/0 via-golden-400/10 to-golden-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                </div>
              </div>

              <div className="group relative text-center cursor-pointer">
                {/* Glassmorphism container */}
                <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-500 ease-out transform group-hover:scale-110 group-hover:bg-white/10 group-hover:border-emerald-400/30 group-hover:shadow-2xl group-hover:shadow-emerald-400/20">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-transparent to-emerald-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute w-2 h-2 bg-emerald-400/40 rounded-full animate-pulse top-4 right-4 group-hover:animate-bounce"></div>
                    <div className="absolute w-1 h-1 bg-emerald-300/60 rounded-full animate-pulse bottom-6 left-6 group-hover:animate-ping"></div>
                    <div className="absolute w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-pulse top-8 left-8 group-hover:animate-bounce delay-100"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-3xl font-bold text-emerald-custom-400 mb-2 transition-all duration-300 group-hover:text-emerald-300 group-hover:scale-110 group-hover:drop-shadow-lg">
                      <span className="inline-block transition-transform duration-300 group-hover:-rotate-12">
                        {filteredServices.length}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                      {t("services.matchingFilters")}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-6">
              {filteredServices.length > 0 ? (
                <div className="grid gap-6">
                  {filteredServices.map((service) => (
                    <div
                      key={service._id || service.id}
                      className="transform transition-all duration-300 hover:scale-[1.01]"
                    >
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl text-gray-600 mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {t("services.noServicesFoundTitle")}
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    {t("services.noServicesFoundMessage")}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-golden-enhanced px-6 py-3 rounded-lg"
                  >
                    {t("services.clearAllFilters")}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
