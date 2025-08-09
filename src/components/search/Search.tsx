import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOROCCAN_CITIES, useTranslatedCities } from '../../consts/cities';
import { JOB_TYPES, useTranslatedJobTypes } from '../../consts/jobs';

export default function Search() {
  const { t } = useTranslation();
  const [city, setCity] = useState('');
  const [job, setJob] = useState('');
  const navigate = useNavigate();
  const translatedCities = useTranslatedCities();
  const translatedJobs = useTranslatedJobTypes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams({
      city: city.trim(),
      job: job.trim(),
    }).toString();

    navigate(`/advanced-search?${query}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur bg-white/5 border border-golden-600/20 rounded-xl p-6 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto text-white shadow-lg"
    >
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="bg-dark-800 border border-golden-600/30 rounded-lg px-4 py-3 w-full md:w-1/2 text-white focus:border-golden-400 focus:outline-none transition-colors"
      >
        <option value="">{t('searchFilter.allCities')}</option>
        {MOROCCAN_CITIES.map((cityKey, index) => (
          <option key={cityKey} value={cityKey}>
            {translatedCities[index]}
          </option>
        ))}
      </select>

      <select
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="bg-dark-800 border border-golden-600/30 rounded-lg px-4 py-3 w-full md:w-1/2 text-white focus:border-golden-400 focus:outline-none transition-colors"
      >
        <option value="">{t('searchFilter.allJobs')}</option>
        {JOB_TYPES.map((jobKey, index) => (
          <option key={jobKey} value={jobKey}>
            {translatedJobs[index]}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-gradient-golden text-dark-900 font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 w-full md:w-fit shadow-md"
      >
        {t('search.searchButton')}
      </button>
    </form>
  );
}
