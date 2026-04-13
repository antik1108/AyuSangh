"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { Card } from "@/components/ui/Card";
import { hospitalsApi } from "@/lib/api";
import {
  MapPin, ChevronRight, Bookmark, PenLine,
  ShieldCheck, Building2, Phone, Clock,
} from "lucide-react";

interface ApiHospital {
  id: string;
  name: string;
  description?: string;
  institutionType: string;
  phone?: string;
  website?: string;
  email?: string;
  openingHours?: string;
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
  departments?: { id: string; name: string }[];
  doctors?: {
    doctor: {
      id: string;
      firstName: string;
      lastName: string;
      specialization: string;
      experienceYears: number;
    };
  }[];
  reviews?: {
    id: string;
    text?: string;
    ratingOverall: number;
    ratingCleanliness: number;
    ratingStaffBehaviour: number;
    ratingWaitTime: number;
    status: string;
    createdAt: string;
    author: { firstName?: string; lastName?: string; email: string };
  }[];
}

const TYPE_LABELS: Record<string, string> = {
  HOSPITAL: "Hospital",
  CLINIC: "Clinic",
  DIAGNOSTIC_CENTRE: "Diagnostic",
  NURSING_HOME: "Nursing Home",
};

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<ApiHospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    hospitalsApi.getById(id)
      .then((res) => {
        const raw = (res.data as { data: ApiHospital }).data;
        setHospital(raw);
      })
      .catch(() => setError("Hospital not found or API is unavailable."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container-page flex-1 py-16 text-center text-slate-400">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container-page flex-1 py-16 text-center">
          <p className="text-slate-500">{error ?? "Hospital not found."}</p>
          <Link href="/hospitals" className="mt-4 inline-block text-sm text-primary-600 hover:underline">
            ← Back to hospitals
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const h = hospital;
  const locationStr = h.location
    ? `${h.location.address}, ${h.location.city}, ${h.location.state} ${h.location.zipCode}`
    : null;

  const approvedReviews = (h.reviews ?? []).filter((r) => r.status === "APPROVED");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="container-page py-5">
          <nav className="mb-3 flex items-center gap-1 text-xs text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/hospitals" className="hover:text-slate-600 transition-colors">Hospitals</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 truncate max-w-[200px]">{h.name}</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                {h.profilePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={h.profilePhoto} alt={h.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={24} className="text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Badge variant="blue">{TYPE_LABELS[h.institutionType] ?? h.institutionType}</Badge>
                  {h.isActive && (
                    <Badge variant="green">
                      <ShieldCheck size={10} className="mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{h.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {locationStr && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {locationStr}
                    </span>
                  )}
                  {h.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-slate-400" />
                      {h.phone}
                    </span>
                  )}
                  {h.openingHours && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {h.openingHours}
                    </span>
                  )}
                </div>
                {h.rating != null && (
                  <div className="mt-2 flex items-center gap-2">
                    <RatingStars rating={h.rating} showValue size="sm" />
                    <span className="text-xs text-slate-400">
                      {approvedReviews.length} review{approvedReviews.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {h.website && (
                <a href={h.website} target="_blank" rel="noopener noreferrer">
                  <Button size="sm">Book Consultation</Button>
                </a>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaved((v) => !v)}
                className={saved ? "border-primary-300 text-primary-600" : ""}
              >
                <Bookmark size={14} className={saved ? "fill-primary-600 text-primary-600" : ""} />
                {saved ? "Saved" : "Save"}
              </Button>
              <Link href={`/reviews/write?hospital=${id}`}>
                <Button variant="outline" size="sm">
                  <PenLine size={14} />
                  Write Review
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-page py-7">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-800 uppercase tracking-wide">About</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {h.description ?? "No description provided."}
              </p>
              {h.services.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {h.services.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
                  </div>
                </div>
              )}
              {(h.departments ?? []).length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Departments</p>
                  <div className="flex flex-wrap gap-1.5">
                    {h.departments!.map((d) => <Badge key={d.id} variant="default">{d.name}</Badge>)}
                  </div>
                </div>
              )}
            </Card>

            {/* Doctors */}
            {(h.doctors ?? []).length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Specialists</h2>
                  <Link href="/doctors" className="text-xs font-medium text-primary-600 hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {h.doctors!.map(({ doctor: d }) => (
                    <Link key={d.id} href={`/doctors/${d.id}`}>
                      <div className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center transition-all hover:border-slate-300 hover:shadow-sm">
                        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                          {d.firstName[0]}{d.lastName[0]}
                        </div>
                        <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-primary-600">
                          Dr. {d.firstName} {d.lastName}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{d.specialization}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{d.experienceYears} yrs exp</p>
                        <span className="mt-2 text-xs font-medium text-primary-600">Consult →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Patient Reviews ({approvedReviews.length})
                </h2>
              </div>
              {approvedReviews.length === 0 ? (
                <Card className="p-6 text-center text-sm text-slate-400">
                  No approved reviews yet.{" "}
                  <Link href={`/reviews/write?hospital=${id}`} className="text-primary-600 hover:underline">
                    Be the first to review.
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {approvedReviews.map((r) => {
                    const name = [r.author.firstName, r.author.lastName].filter(Boolean).join(" ") || r.author.email;
                    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <Card key={r.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{name}</p>
                              <p className="text-xs text-slate-400">
                                {new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <RatingStars rating={r.ratingOverall} showValue size="sm" />
                        </div>
                        {r.text && (
                          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{r.text}</p>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Performance */}
            {h.rating != null && (
              <Card className="p-4">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Performance Indices
                </h3>
                <div className="space-y-3.5">
                  {[
                    { label: "Overall Satisfaction", val: h.rating },
                    { label: "Cleanliness & Hygiene", val: h.ratingCleanliness },
                    { label: "Staff Behaviour", val: h.ratingStaffBehaviour },
                    { label: "Wait Time Efficiency", val: h.ratingWaitTime },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs text-slate-600">{label}</span>
                        <span className="text-xs font-bold text-slate-800">
                          {val != null ? val.toFixed(1) : "—"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-primary-500 transition-all"
                          style={{ width: val != null ? `${(val / 5) * 100}%` : "0%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick info */}
            <Card className="p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Info</h3>
              <div className="space-y-2.5">
                {locationStr && (
                  <div className="flex items-start gap-2.5">
                    <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-xs text-slate-600">{locationStr}</span>
                  </div>
                )}
                {h.phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone size={13} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-xs text-slate-600">{h.phone}</span>
                  </div>
                )}
                {h.openingHours && (
                  <div className="flex items-start gap-2.5">
                    <Clock size={13} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-xs text-slate-600">{h.openingHours}</span>
                  </div>
                )}
                {h.email && (
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs text-slate-400 mt-0.5">✉</span>
                    <span className="text-xs text-slate-600">{h.email}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
