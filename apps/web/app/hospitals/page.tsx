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
import { Hospital } from "@/types";
import { debounce } from "@/lib/utils";
import { MapPin, Building2, Search, SlidersHorizontal } from "lucide-react";

// Mock data — replace with API call
const MOCK_HOSPITALS: Hospital[] = [
  {
    id: "1",
    name: "Global Health Institutional Center",
    description:
      "Recognized as the region's leading tertiary care center, Global Health provides comprehensive oncology, cardiology, and robotic-assisted surgical services.",
    type: "MULTI_SPECIALTY",
    location: { address: "Parel West", city: "Mumbai", state: "MH", zipCode: "400012", country: "India" },
    distance: "1.2 km",
    ratings: { overall: 4.8, cleanliness: 4.9, staff: 4.7, waitTime: 4.2, facility: 4.8, totalReviews: 1240 },
    services: ["MRI", "ICU", "Emergency 24/7", "+4"],
    isVerified: true,
  },
  {
    id: "2",
    name: "Precision Diagnostics Hub",
    description:
      "Accredited high-capacity diagnostic facility specialising in advanced imaging, genomics testing, and rapid pathology reporting with home collection.",
    type: "DIAGNOSTIC",
    location: { address: "Bandra West", city: "Mumbai", state: "MH", zipCode: "400050", country: "India" },
    distance: "3.5 km",
    ratings: { overall: 4.6, cleanliness: 4.8, staff: 4.5, waitTime: 4.8, facility: 4.5, totalReviews: 680 },
    services: ["CT", "Lab"],
    isVerified: true,
  },
  {
    id: "3",
    name: "Sunrise Specialty Hospital",
    description:
      "Premier multi-specialty institution known for excellence in mother and child care, orthopedics, and integrated wellness therapies.",
    type: "MULTI_SPECIALTY",
    location: { address: "Andheri East", city: "Mumbai", state: "MH", zipCode: "400069", country: "India" },
    distance: "5.1 km",
    ratings: { overall: 4.9, cleanliness: 5.0, staff: 4.8, waitTime: 4.7, facility: 4.9, totalReviews: 2100 },
    services: ["24/7", "ICU"],
    isVerified: true,
  },
];

const TYPE_LABELS: Record<Hospital["type"], string> = {
  MULTI_SPECIALTY: "Multi-specialty",
  DIAGNOSTIC: "Diagnostic",
  CLINIC: "Clinic",
  GOVERNMENT: "Government",
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Hospital["type"][]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setHospitals(MOCK_HOSPITALS);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((val: unknown) => {
      console.log("search:", val);
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const toggleType = (type: Hospital["type"]) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = hospitals.filter((h) => {
    const matchSearch =
      !search ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.city.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(h.type);
    const matchRating = !minRating || h.ratings.overall >= minRating;
    return matchSearch && matchType && matchRating;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container-page flex-1 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {isLoading ? "Loading..." : `${filtered.length} Institutions Found`}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing top-rated hospitals and diagnostics in Mumbai.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Filters
              </span>
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
                {(["MULTI_SPECIALTY", "DIAGNOSTIC", "CLINIC", "GOVERNMENT"] as Hospital["type"][]).map((t) => (
                  <label key={t} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(t)}
                      onChange={() => toggleType(t)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">{TYPE_LABELS[t]}</span>
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
            {/* Search + sort bar */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search institutions..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full rounded-md border border-slate-300 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 lg:hidden">
                <SlidersHorizontal size={14} />
                Filters
              </button>
              <select className="rounded-md border border-slate-300 py-2 px-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Relevance</option>
                <option>Rating: High to Low</option>
                <option>Distance</option>
              </select>
            </div>

            {/* Results */}
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <HospitalCardSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No institutions found"
                  description="Try adjusting your filters or search query."
                  action={{ label: "Clear filters", onClick: () => { setSearch(""); setSelectedTypes([]); setMinRating(null); } }}
                />
              ) : (
                filtered.map((h) => <HospitalCard key={h.id} hospital={h} />)
              )}
            </div>

            {/* Pagination */}
            {!isLoading && filtered.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-1">
                {[1, 2, 3, "...", 8].map((p, i) => (
                  <button
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded text-sm ${
                      p === 1
                        ? "bg-primary-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function HospitalCard({ hospital: h }: { hospital: Hospital }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
      {/* Image */}
      <div className="h-36 w-full shrink-0 overflow-hidden rounded bg-slate-100 sm:w-48 flex items-center justify-center">
        {h.isVerified && (
          <div className="absolute top-2 left-2">
            <Badge variant="green">Verified</Badge>
          </div>
        )}
        <Building2 size={36} className="text-slate-300" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-slate-900">{h.name}</h2>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                <MapPin size={11} />
                {h.location.address}, {h.location.city}
                {h.distance && ` • ${h.distance} away`}
              </p>
            </div>
            <Badge variant="blue">{TYPE_LABELS[h.type]}</Badge>
          </div>

          {/* Rating breakdown */}
          <div className="mt-3 flex flex-wrap gap-4">
            {[
              { label: "Overall", val: h.ratings.overall },
              { label: "Cleanliness", val: h.ratings.cleanliness },
              { label: "Staff", val: h.ratings.staff },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
                <p className="text-base font-semibold text-slate-800">
                  {val.toFixed(1)} <span className="text-amber-400">★</span>
                </p>
              </div>
            ))}
          </div>

          <p className="mt-2 text-sm text-slate-500 line-clamp-2">{h.description}</p>

          {/* Services */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {h.services.map((s) => (
              <Badge key={s} variant="default">{s}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <RatingStars rating={h.ratings.overall} showValue />
            <span className="text-xs text-slate-400">({h.ratings.totalReviews.toLocaleString()} reviews)</span>
          </div>
          <Link href={`/hospitals/${h.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
