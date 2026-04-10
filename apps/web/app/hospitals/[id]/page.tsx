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
import { MapPin, ChevronRight, Bookmark, PenLine, ShieldCheck } from "lucide-react";

// Mock — replace with API
const HOSPITAL = {
  id: "1",
  name: "Global Health Institutional Center",
  type: "Multi-specialty",
  location: "Bandra West, Mumbai, Maharashtra 400050",
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
      tags: ["Verified Visit", "Treatment: Cardiac Screening"],
    },
    {
      id: "r2",
      author: "Meera Shah",
      initials: "MS",
      date: "September 23, 2024",
      rating: 4.5,
      content:
        "The medical staff is excellent, but the parking can be a bit tricky during peak afternoon hours. I highly recommend the diagnostic lab; they provided results via the app within 4 hours. Dr. Roy is exceptional in her diagnosis.",
      tags: ["Verified Visit", "Treatment: Neurological Evaluation"],
    },
  ],
};

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);

  // In production: fetch hospital by id
  const h = HOSPITAL;
  if (!h) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container-page py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/hospitals" className="hover:text-slate-600">Hospitals</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600">{h.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="blue">{h.type}</Badge>
              {h.isVerified && (
                <Badge variant="green">
                  <ShieldCheck size={10} className="mr-1" />
                  Verified
                </Badge>
              )}
              <RatingStars rating={h.rating} showValue size="sm" />
              <span className="text-xs text-slate-400">({h.totalReviews.toLocaleString()} reviews)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{h.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={13} />
              {h.location}
              <button className="ml-1 text-primary-600 hover:underline text-xs">View on Map</button>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm">Book Consultation</Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSaved((v) => !v)}
              className={saved ? "text-primary-600 border-primary-300" : ""}
            >
              <Bookmark size={14} className={saved ? "fill-primary-600" : ""} />
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="p-5">
              <h2 className="mb-3 text-base font-semibold text-slate-800">Institutional Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{h.description}</p>
              <div className="mt-4">
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
                <h2 className="text-base font-semibold text-slate-800">Leading Specialists</h2>
                <Link href="/doctors" className="text-xs text-primary-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {h.doctors.map((d) => (
                  <Link key={d.id} href={`/doctors/${d.id}`}>
                    <Card hover className="p-3 text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                        {d.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{d.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{d.specialty}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{d.experience} Exp.</p>
                      <Button variant="outline" size="sm" className="mt-2 w-full text-xs">
                        Consult
                      </Button>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">Patient Voices</h2>
                <select className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                </select>
              </div>
              <div className="space-y-3">
                {h.reviews.map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
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
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <Badge key={t} variant="green">{t}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full" size="sm">
                Load More Reviews
              </Button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Performance Indices</h3>
              <div className="space-y-3">
                {[
                  { label: "Cleanliness & Hygiene", val: h.ratings.cleanliness },
                  { label: "Staff Behaviour", val: h.ratings.staff },
                  { label: "Wait Time Efficiency", val: h.ratings.waitTime },
                  { label: "Overall Satisfaction", val: h.ratings.overall },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className="text-xs font-semibold text-slate-700">{val.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-primary-500"
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                This hospital ranks in the top 5% of facilities in Mumbai based on verified patient data.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
