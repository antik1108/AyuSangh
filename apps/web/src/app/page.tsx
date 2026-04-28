'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HospitalCard from '@/components/HospitalCard';
import { apiFetch } from '@/lib/api';
import { Institution } from '@/lib/types';

const INSTITUTION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'CLINIC', label: 'Clinic' },
  { value: 'DIAGNOSTIC_CENTRE', label: 'Diagnostic Centre' },
  { value: 'NURSING_HOME', label: 'Nursing Home' },
];

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [topHospitals, setTopHospitals] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Institution[]>('/hospitals')
      .then((data) => {
        const sorted = [...data]
          .sort((a, b) => Number(b.averageRating) - Number(a.averageRating))
          .slice(0, 6);
        setTopHospitals(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    if (type) params.set('type', type);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Find the Right Healthcare</h1>
          <p className="text-blue-100 text-lg mb-10">
            Discover hospitals, clinics, and diagnostic centres. Read real reviews.
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-xl"
          >
            <input
              type="text"
              placeholder="Enter city (e.g. Noida, Delhi)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {INSTITUTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Institutions</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse h-36" />
            ))}
          </div>
        ) : topHospitals.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No institutions found. Make sure the API is running.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topHospitals.map((h) => (
              <HospitalCard key={h.id} hospital={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
