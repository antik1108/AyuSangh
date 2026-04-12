"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Stethoscope, Search } from "lucide-react";

interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  hospital: string;
  trustScore: number;
}

const MOCK_DOCTORS: DoctorItem[] = [
  { id: "d1", name: "Dr. Vikram Sethi", specialty: "Senior Cardiologist & Interventional Specialist", experience: "22+ Years", hospital: "Metro Heart Institute", trustScore: 4.9 },
  { id: "d2", name: "Dr. Ananya Roy", specialty: "Head of Neurology", experience: "14 Years", hospital: "Global Health Center", trustScore: 4.7 },
  { id: "d3", name: "Dr. Sameer Khan", specialty: "Oncologist", experience: "10 Years", hospital: "Sunrise Specialty Hospital", trustScore: 4.6 },
  { id: "d4", name: "Dr. Priya Sharma", specialty: "Pediatric Specialist", experience: "12 Years", hospital: "Global Health Center", trustScore: 4.8 },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => { setDoctors(MOCK_DOCTORS); setIsLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = doctors.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

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
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

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
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No doctors found"
            description="Try a different name or specialty."
            action={{ label: "Clear search", onClick: () => setSearch("") }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <Link key={d.id} href={`/doctors/${d.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                      {d.name.split(" ")[1]?.[0] ?? "D"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{d.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{d.specialty}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{d.experience} experience</span>
                      <Badge variant="blue">★ {d.trustScore}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{d.hospital}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    View Profile
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
