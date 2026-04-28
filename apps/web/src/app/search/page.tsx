'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [q, setQ] = useState(searchParams.get('q') || '');

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function fetchResults() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      const cityParam = searchParams.get('city');
      const typeParam = searchParams.get('type');
      const qParam = searchParams.get('q');
      if (cityParam) params.set('city', cityParam);
      if (typeParam) params.set('type', typeParam);
      if (qParam) params.set('name', qParam);

      const data = await apiFetch<Institution[]>(`/hospitals?${params.toString()}`);
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    if (type) params.set('type', type);
    if (q.trim()) params.set('q', q.trim());
    router.push(`/search?${params.toString()}`);
  }

  const cityParam = searchParams.get('city');
  const typeParam = searchParams.get('type');
  const qParam = searchParams.get('q');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Filter Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 mb-8 shadow-sm"
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          {INSTITUTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {qParam || cityParam || typeParam
              ? `Results for "${qParam || cityParam || typeParam}"`
              : 'All Institutions'}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">{results.length} found</p>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse h-36" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No institutions found.</p>
          <p className="text-gray-400 text-sm mt-1">Try a different city or type.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((h) => (
            <HospitalCard key={h.id} hospital={h} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8 text-gray-500">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
