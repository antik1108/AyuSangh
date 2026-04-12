"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { Card } from "@/components/ui/Card";
import {
  MapPin,
  ChevronRight,
  Bookmark,
  PenLine,
  ShieldCheck,
  Building2,
  Phone,
  Clock,
} from "lucide-react";

const HOSPITAL = {
  id: "1",
  name: "Global Health Institutional Center",
  type: "Multi-specialty",
  location: "Bandra West, Mumbai, Maharashtra 400050",
  phone: "+91 22 6789 0000",
  hours: "Open 24 hours",
  rating: 4.8,
  totalReviews: 1240,
  isVerified: true,
  description:
    "Global Health Institutional Center stands as a beacon of medical excellence in Western Mumbai, integrating state-of-the-art research with compassionate patient care. Founded in 1988, the facility has consistently ranked in the top 1% for diagnostic accuracy and surgical outcomes across India.",
  specialties: ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Radiology", "Emergency Care"],
  ratings: { cleanliness: 4.9, staff: 4.7, waitTime: 4.2, overall: 4.8 },
  doctors: [
    { id: "d1", name: "Dr. Vikram Mehra", specialty: "Senior Cardiologist", experience: "16 Years" },
    { id: "d2", name: "Dr. Ananya Roy", specialty: "Head of Neurology", experience: "14 Years" },
    { id: "d3", name: "Dr. Sameer Khan", specialty: "Oncologist", experience: "10 Years" },
    { id: "d4", name: "Dr. Priya Sharma", specialty: "Pediatric Specialist", experience: "12 Years" },
  ],
  reviews: [
    {
      id: "r1",
      author: "Rahul Kapoor",
      initials: "RK",
      date: "October 09, 2024",
      rating: 5.0,
      content:
        "Extremely efficient experience. From the visit to the consultation with Dr. Mehra, everything was professional. The waiting room was spacious and well-ventilated. I was particularly impressed by the digital queue system which kept me informed about my wait time.",
      tags: ["Verified Visit", "Cardiac Screening"],
    },
    {
      id: "r2",
      author: "Meera Shah",
      initials: "MS",
      date: "September 23, 2024",
      rating: 4.5,
      content:
        "The medical staff is excellent, but the parking can be a bit tricky during peak afternoon hours. I highly recommend the diagnostic lab; they provided results via the app within 4 hours. Dr. Roy is exceptional in her diagnosis.",
      tags: ["Verified Visit", "Neurological Evaluation"],
    },
  ],
};

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const h = HOSPITAL;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* ── Page header ── */}
      <div className="border-b border-slate-100 bg-white">
        <div className="container-page py-5">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1 text-xs text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/hospitals" className="hover:text-slate-600 transition-colors">Hospitals</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 truncate max-w-[200px]">{h.name}</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              {/* Icon */}
              <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <Building2 size={24} className="text-slate-400" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Badge variant="blue">{h.type}</Badge>
                  {h.isVerified && (
                    <Badge variant="green">
                      <ShieldCheck size={10} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{h.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    {h.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-slate-400" />
                    {h.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    {h.hours}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <RatingStars rating={h.rating} showValue size="sm" />
                  <span className="text-xs text-slate-400">
                    {h.totalReviews.toLocaleString()} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button size="sm">Book Consultation</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaved((v) => !v)}
                className={saved ? "border-primary-300 text-primary-600" : ""}
              >
                <Bookmark
                  size={14}
                  className={saved ? "fill-primary-600 text-primary-600" : ""}
                />
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

      {/* ── Body ── */}
      <div className="container-page py-7">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                About
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{h.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Core Specialties
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {h.specialties.map((s) => (
                    <Badge key={s} variant="default">{s}</Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Doctors */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Leading Specialists
                </h2>
                <Link
                  href="/doctors"
                  className="text-xs font-medium text-primary-600 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {h.doctors.map((d) => (
                  <Link key={d.id} href={`/doctors/${d.id}`}>
                    <div className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center transition-all duration-150 hover:border-slate-300 hover:shadow-sm">
                      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                        {d.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-primary-600 transition-colors">
                        {d.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{d.specialty}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{d.experience}</p>
                      <span className="mt-2 text-xs font-medium text-primary-600">
                        Consult →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Patient Reviews
                </h2>
                <select className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                </select>
              </div>
              <div className="space-y-3">
                {h.reviews.map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {r.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{r.author}</p>
                          <p className="text-xs text-slate-400">{r.date}</p>
                        </div>
                      </div>
                      <RatingStars rating={r.rating} showValue size="sm" />
                    </div>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{r.content}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <Badge key={t} variant="green">{t}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full" size="sm">
                Load more reviews
              </Button>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-4">
            {/* Performance */}
            <Card className="p-4">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Performance Indices
              </h3>
              <div className="space-y-3.5">
                {[
                  { label: "Cleanliness & Hygiene", val: h.ratings.cleanliness },
                  { label: "Staff Behaviour", val: h.ratings.staff },
                  { label: "Wait Time Efficiency", val: h.ratings.waitTime },
                  { label: "Overall Satisfaction", val: h.ratings.overall },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs text-slate-600">{label}</span>
                      <span className="text-xs font-bold text-slate-800">{val.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-primary-500 transition-all"
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                Ranks in the top 5% of facilities in Mumbai based on verified patient data.
              </p>
            </Card>

            {/* Quick info */}
            <Card className="p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quick Info
              </h3>
              <div className="space-y-2.5">
                {[
                  { icon: MapPin, label: h.location },
                  { icon: Phone, label: h.phone },
                  { icon: Clock, label: h.hours },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon size={13} className="mt-0.5 shrink-0 text-slate-400" />
                    <span className="text-xs text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
