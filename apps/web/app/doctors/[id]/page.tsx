"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RatingStars } from "@/components/ui/RatingStars";
import { doctorsApi } from "@/lib/api";
import type { DoctorSummary } from "@ayusangh/shared-types";
import { MapPin, GraduationCap, ChevronRight, Stethoscope } from "lucide-react";

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    doctorsApi.getById(id)
      .then((res) => {
        const raw = res.data.data;
        setDoctor(raw);
      })
      .catch(() => setError("Doctor not found or API is unavailable."))
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

  if (error || !doctor) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container-page flex-1 py-16 text-center">
          <p className="text-slate-500">{error ?? "Doctor not found."}</p>
          <Link href="/doctors" className="mt-4 inline-block text-sm text-primary-600 hover:underline">
            ← Back to doctors
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const d = doctor;
  const avgRating = d.reviews.length
    ? d.reviews.reduce((s, r) => s + r.ratingOverall, 0) / d.reviews.length
    : null;
  const primaryHospital = d.institutions[0]?.hospital;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="container-page py-5">
          <nav className="mb-3 flex items-center gap-1 text-xs text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/doctors" className="hover:text-slate-600 transition-colors">Doctors</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">Dr. {d.firstName} {d.lastName}</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-primary-50 text-xl font-bold text-primary-600">
                {d.firstName[0]}{d.lastName[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Dr. {d.firstName} {d.lastName}
                </h1>
                <p className="text-sm font-medium text-primary-600">{d.specialization}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Stethoscope size={12} className="text-slate-400" />
                    {d.experienceYears} years experience
                  </span>
                  {primaryHospital && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {primaryHospital.name}
                    </span>
                  )}
                </div>
                {avgRating != null && (
                  <div className="mt-2">
                    <RatingStars rating={avgRating} showValue size="sm" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {d.phone && (
                <a href={`tel:${d.phone}`}>
                  <Button size="sm">Book Consultation</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-page py-7">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expertise */}
            <Card className="p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Expertise & Qualifications
              </h2>

              {d.bio && (
                <p className="mb-4 text-sm text-slate-600 leading-relaxed">{d.bio}</p>
              )}

              {d.qualifications.length > 0 && (
                <>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Academic Background
                  </p>
                  <div className="space-y-2.5 mb-4">
                    {d.qualifications.map((q) => (
                      <div key={q} className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50">
                          <GraduationCap size={13} className="text-primary-600" />
                        </div>
                        <p className="text-sm text-slate-700">{q}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {d.institutions.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Affiliated Institutions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.institutions.map(({ hospital }) => (
                      <Link key={hospital.id} href={`/hospitals/${hospital.id}`}>
                        <Badge variant="blue">{hospital.name}</Badge>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Reviews */}
            <div>
              <h2 className="mb-3 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Patient Reviews ({d.reviews.length})
              </h2>
              {d.reviews.length === 0 ? (
                <Card className="p-6 text-center text-sm text-slate-400">
                  No reviews yet.
                </Card>
              ) : (
                <Card className="p-5">
                  <div className="flex flex-wrap gap-3">
                    {d.reviews.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                        <RatingStars rating={r.ratingOverall} size="sm" />
                        <span className="text-xs font-medium text-slate-600">{r.ratingOverall.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quick Info
              </h3>
              <div className="divide-y divide-slate-100">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-slate-500">Experience</span>
                  <span className="text-sm font-bold text-slate-900">{d.experienceYears} years</span>
                </div>
                {avgRating != null && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-slate-500">Patient Rating</span>
                    <span className="text-sm font-bold text-slate-900">{avgRating.toFixed(1)} / 5</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-slate-500">Total Reviews</span>
                  <span className="text-sm font-bold text-slate-900">{d.reviews.length}</span>
                </div>
                {d.consultationFee != null && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-slate-500">Consultation Fee</span>
                    <span className="text-sm font-bold text-slate-900">₹{d.consultationFee}</span>
                  </div>
                )}
                {d.phone && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-slate-500">Phone</span>
                    <span className="text-sm font-bold text-slate-900">{d.phone}</span>
                  </div>
                )}
              </div>
            </Card>

            {d.institutions.length > 0 && (
              <Card className="p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Affiliated Hospitals
                </h3>
                <div className="space-y-2.5">
                  {d.institutions.map(({ hospital }) => (
                    <Link key={hospital.id} href={`/hospitals/${hospital.id}`} className="block">
                      <div className="flex items-start gap-2 rounded-md p-2 hover:bg-slate-50 transition-colors">
                        <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
                        <p className="text-xs font-medium text-slate-700">{hospital.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
