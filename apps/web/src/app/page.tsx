"use client";

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

type SearchHospital = {
  id: string;
  name: string;
  description: string | null;
  location?: {
    city: string;
    state: string;
  } | null;
};

type SearchDoctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
};

export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<SearchHospital[]>([]);
  const [doctors, setDoctors] = useState<SearchDoctor[]>([]);

  const hasResults = useMemo(() => hospitals.length > 0 || doctors.length > 0, [hospitals.length, doctors.length]);

  const runSearch = async (searchTerm: string) => {
    const normalized = searchTerm.trim();
    if (!normalized) {
      setHospitals([]);
      setDoctors([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/search?q=${encodeURIComponent(normalized)}`);
      const data: { hospitals?: SearchHospital[]; doctors?: SearchDoctor[]; message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }

      setHospitals(data.hospitals ?? []);
      setDoctors(data.doctors ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      setHospitals([]);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await runSearch(query);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar segment */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">AyuSangh</h1>
        </div>
        <div className="space-x-6 text-sm font-medium">
          <Link href="/login" className="text-slate-600 hover:text-blue-600 transition">Log in</Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-md hover:shadow-lg">Get Started</Link>
        </div>
      </nav>

      {/* Hero segment */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center mt-12 mb-24">
        <span className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-4 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          Digital Healthcare Discovery
        </span>
        <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
          Find the Right Care, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Right When You Need It.</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
          Search thousands of highly-rated hospitals and verified doctors effortlessly. Powered by patient reviews and transparent data.
        </p>
        
        <form onSubmit={onSubmit} className="w-full max-w-2xl relative group drop-shadow-xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospitals, specialties, or doctors..." 
            className="w-full pl-16 pr-32 py-5 rounded-full border-0 shadow-lg text-lg focus:ring-4 focus:ring-blue-100 transition duration-300 outline-none block bg-white font-medium text-slate-800 placeholder-slate-400"
          />
          <button type="submit" disabled={loading} className="absolute right-3 top-3 bottom-3 bg-blue-600 text-white px-8 rounded-full font-bold hover:bg-blue-700 transition duration-300 shadow active:transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
        )}

        {!loading && query.trim() && !error && !hasResults && (
          <p className="mt-4 text-sm font-semibold text-slate-600">No results found for "{query.trim()}".</p>
        )}

        {hasResults && (
          <div className="w-full max-w-4xl mt-8 grid md:grid-cols-2 gap-5 text-left">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Hospitals ({hospitals.length})</h3>
              <div className="space-y-3 max-h-72 overflow-auto pr-1">
                {hospitals.length === 0 ? (
                  <p className="text-sm text-slate-500">No hospitals found.</p>
                ) : (
                  hospitals.map((hospital) => (
                    <div key={hospital.id} className="rounded-xl border border-slate-100 p-3">
                      <p className="font-semibold text-slate-900">{hospital.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {hospital.location?.city ? `${hospital.location.city}, ${hospital.location.state}` : 'Location unavailable'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Doctors ({doctors.length})</h3>
              <div className="space-y-3 max-h-72 overflow-auto pr-1">
                {doctors.length === 0 ? (
                  <p className="text-sm text-slate-500">No doctors found.</p>
                ) : (
                  doctors.map((doctor) => (
                    <div key={doctor.id} className="rounded-xl border border-slate-100 p-3">
                      <p className="font-semibold text-slate-900">{doctor.firstName} {doctor.lastName}</p>
                      <p className="text-sm text-slate-500 mt-1">{doctor.specialization}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 flex space-x-12 opacity-60 grayscale hover:grayscale-0 transition duration-500">
          <p className="font-bold text-slate-400 tracking-widest uppercase text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
            24/7 Booking
          </p>
          <p className="font-bold text-slate-400 tracking-widest uppercase text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            Verified Institutions
          </p>
        </div>
      </div>
    </main>
  );
}
