"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { HospitalCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { debounce } from "@/lib/utils";
import { hospitalsApi } from "@/lib/api";
import { MapPin, Building2, Search, SlidersHorizontal } from "lucide-react";

// Raw shape returned by the API (Prisma Hospital model)
interface ApiHospital {
  id: string;
  name: string;
  description?: string;
  institutionType: string;
  phone?: string;
  website?: string;
  email?: string;
  services: string[];
  rating?: number;
  ratingCleanliness?: number;
  ratingStaffBehaviour?: number;
  ratingWaitTime?: number;
  profilePhoto?: string;
  isActive: boolean;
  location?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const TYPE_LABELS: Record<string, string> = {
  HOSPITAL: "Hospital",
  CLINIC: "Clinic",
  DIAGNOSTIC_CENTRE: "Diagnostic",
  NURSING_HOME: "Nursing Home",
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<ApiHospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  const fetchHospitals = useCallback(async (name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await hospitalsApi.list(name ? { name } : undefined);
      // API response is wrapped: { data: [...], timestamp: "..." }
      const raw = (res.data as { data: ApiHospital[] }).data;
      setHospitals(Array.isArray(raw) ? raw : []);
    } catch {
      setError("Failed to load hospitals. Make sure the API is running.");
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const debouncedSearch = useCallback(
    debounce((val: unknown) => fetchHospitals((val as string) || undefined), 400),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = hospitals.filter((h) => {
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(h.institutionType);
    const matchRating = !minRating || (h.rating ?? 0) >= minRating;
    return matchType && matchRating;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container-page flex-1 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {isLoading ? "Loading..." : `${filtered.length} Institution${filtered.length !== 1 ? "s" : ""} Found`}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse verified hospitals and diagnostic centres.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Filters</span>
              <button
                onClick={() => { setSelectedTypes([]); setMinRating(null); }}
                className="text-xs text-primary-600 hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-700">Institution Type</p>
                {Object.entries(TYPE_LABELS).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(val)}
                      onChange={() => toggleType(val)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">{label}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-700">Minimum Rating</p>
                {[4, 3].map((r) => (
                  <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      className="border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">{r}.0+ Stars</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full rounded-md border border-slate-300 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 lg:hidden">
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <HospitalCardSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No institutions found"
                  description={hospitals.length === 0 ? "No hospitals have been registered yet." : "Try adjusting your filters."}
                  action={{ label: "Clear filters", onClick: () => { setSearch(""); setSelectedTypes([]); setMinRating(null); fetchHospitals(); } }}
                />
              ) : (
                filtered.map((h) => <HospitalCard key={h.id} hospital={h} />)
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function HospitalCard({ hospital: h }: { hospital: ApiHospital }) {
  return (
    <div className="flex flex-col gap-0 rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-150 hover:border-slate-300 hover:shadow-md sm:flex-row">
      <div className="relative h-40 w-full shrink-0 bg-gradient-to-br from-slate-100 to-slate-50 sm:h-auto sm:w-44 flex items-center justify-center">
        {h.profilePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={h.profilePhoto} alt={h.name} className="h-full w-full object-cover" />
        ) : (
          <Building2 size={32} className="text-slate-200" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900 leading-snug">{h.name}</h2>
              {h.location && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={11} className="shrink-0" />
                  {h.location.address}, {h.location.city}
                </p>
              )}
            </div>
            <Badge variant="blue" className="shrink-0">
              {TYPE_LABELS[h.institutionType] ?? h.institutionType}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-5">
            {[
              { label: "Overall", val: h.rating },
              { label: "Cleanliness", val: h.ratingCleanliness },
              { label: "Staff", val: h.ratingStaffBehaviour },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm font-bold text-slate-800">
                  {val != null ? val.toFixed(1) : "—"}{" "}
                  {val != null && <span className="text-amber-400 font-normal">★</span>}
                </p>
              </div>
            ))}
          </div>

          {h.description && (
            <p className="mt-2.5 text-sm text-slate-500 leading-relaxed line-clamp-2">
              {h.description}
            </p>
          )}

          {h.services.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {h.services.slice(0, 4).map((s) => (
                <Badge key={s} variant="default">{s}</Badge>
              ))}
              {h.services.length > 4 && (
                <Badge variant="default">+{h.services.length - 4}</Badge>
              )}
            </div>
          )}
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            {h.rating != null ? (
              <RatingStars rating={h.rating} showValue />
            ) : (
              <span className="text-xs text-slate-400">No ratings yet</span>
            )}
          </div>
          <Link href={`/hospitals/${h.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
