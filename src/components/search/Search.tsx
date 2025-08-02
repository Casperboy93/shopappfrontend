import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOROCCAN_CITIES } from '../../consts/cities';
import { JOB_TYPES } from '../../consts/jobs';

export default function Search() {
  const { t } = useTranslation();
  const [city, setCity] = useState('');
  const [job, setJob] = useState('');
  const navigate = useNavigate();

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
        <option value="">{t('search.allCities')}</option>
        {MOROCCAN_CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="bg-dark-800 border border-golden-600/30 rounded-lg px-4 py-3 w-full md:w-1/2 text-white focus:border-golden-400 focus:outline-none transition-colors"
      >
        <option value="">{t('search.allJobs')}</option>
        {JOB_TYPES.map((j) => (
          <option key={j} value={j}>
            {j}
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
