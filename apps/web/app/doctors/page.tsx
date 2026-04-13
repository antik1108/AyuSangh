"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { doctorsApi } from "@/lib/api";
import { debounce } from "@/lib/utils";
import { Stethoscope, Search } from "lucide-react";

interface ApiDoctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experienceYears: number;
  bio?: string;
  consultationFee?: number;
  profilePhoto?: string;
  qualifications: string[];
  reviews: { ratingOverall: number }[];
  institutions: { hospital: { id: string; name: string } }[];
}

function avgRating(reviews: { ratingOverall: number }[]) {
  if (!reviews.length) return null;
  return reviews.reduce((s, r) => s + r.ratingOverall, 0) / reviews.length;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<ApiDoctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchDoctors = useCallback(async (q?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await doctorsApi.list(q ? { specialization: q } : undefined);
      const raw = (res.data as { data: ApiDoctor[] }).data;
      setDoctors(Array.isArray(raw) ? raw : []);
    } catch {
      setError("Failed to load doctors. Make sure the API is running.");
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const debouncedSearch = useCallback(
    debounce((val: unknown) => fetchDoctors((val as string) || undefined), 400),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container-page flex-1 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Find a Doctor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse verified specialists affiliated with top institutions.
          </p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={handleSearch}
            className="w-full rounded-md border border-slate-300 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No doctors found"
            description={search ? "Try a different name or specialization." : "No doctors have been registered yet."}
            action={search ? { label: "Clear search", onClick: () => { setSearch(""); fetchDoctors(); } } : undefined}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => {
              const rating = avgRating(d.reviews);
              const hospital = d.institutions[0]?.hospital;
              return (
                <Link key={d.id} href={`/doctors/${d.id}`}>
                  <Card hover className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                        {d.firstName[0]}{d.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          Dr. {d.firstName} {d.lastName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {d.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{d.experienceYears} yrs experience</span>
                        {rating != null ? (
                          <Badge variant="blue">★ {rating.toFixed(1)}</Badge>
                        ) : (
                          <span className="text-slate-400 text-xs">No reviews</span>
                        )}
                      </div>
                      {hospital && (
                        <p className="text-xs text-slate-400 truncate">{hospital.name}</p>
                      )}
                      {d.consultationFee != null && (
                        <p className="text-xs text-slate-400">
                          Consultation: ₹{d.consultationFee}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      View Profile
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
