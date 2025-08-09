import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MOROCCAN_CITIES } from '../../consts/cities';
import { JOB_TYPES } from '../../consts/jobs';

interface Props {
  onFilter: (filters: { city: string; job: string }) => void;
  initialCity?: string;
  initialJob?: string;
}

export default function SearchFilter({ onFilter, initialCity = '', initialJob = '' }: Props) {
  const { t } = useTranslation();
  const [city, setCity] = useState(initialCity);
  const [job, setJob] = useState(initialJob);

  // Update local state when initial values change
  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  useEffect(() => {
    setJob(initialJob);
  }, [initialJob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ city, job });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur bg-white/5 border border-golden-600/20 rounded-xl p-6 mb-8 flex flex-col sm:flex-row gap-4 text-white shadow-lg"
    >
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="bg-dark-800 border border-golden-600/30 rounded-lg px-4 py-3 w-full sm:w-1/3 text-white focus:border-golden-400 focus:outline-none transition-colors"
      >
        <option value="">{t('searchFilter.allCities')}</option>
        {MOROCCAN_CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="bg-dark-800 border border-golden-600/30 rounded-lg px-4 py-3 w-full sm:w-1/3 text-white focus:border-golden-400 focus:outline-none transition-colors"
      >
        <option value="">{t('searchFilter.allJobs')}</option>
        {JOB_TYPES.map((j) => (
          <option key={j} value={j}>
            {j}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-gradient-golden text-dark-900 font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 w-full sm:w-fit shadow-md"
      >
        {t('searchFilter.apply')}
      </button>
    </form>
  );
}
