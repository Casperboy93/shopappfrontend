import { useState } from 'react';
import { MOROCCAN_CITIES } from '../../consts/cities';
import { JOB_TYPES } from '../../consts/jobs';

interface Props {
  onFilter: (filters: { city: string; job: string }) => void;
}

export default function SearchFilter({ onFilter }: Props) {
  const [city, setCity] = useState('');
  const [job, setJob] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ city, job });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur bg-white/10 border border-white/20 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 text-white"
    >
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="bg-black border border-white/30 rounded px-3 py-2 w-full sm:w-1/4 text-white"
      >
        <option value="">All Cities</option>
        {MOROCCAN_CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={job}
        onChange={(e) => setJob(e.target.value)}
        className="bg-black border border-white/30 rounded px-3 py-2 w-full sm:w-1/4 text-white"
      >
        <option value="">All Jobs</option>
        {JOB_TYPES.map((j) => (
          <option key={j} value={j}>
            {j}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-white hover:text-yellow-500 transition w-full sm:w-fit"
      >
        Apply
      </button>
    </form>
  );
}
