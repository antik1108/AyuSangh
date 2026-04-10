import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RatingStars } from "@/components/ui/RatingStars";
import { MapPin, GraduationCap, ChevronRight } from "lucide-react";

const DOCTOR = {
  id: "d1",
  name: "Dr. Vikram Sethi",
  title: "Senior Cardiologist & Interventional Specialist",
  experience: "22+ Years Clinical Practice",
  affiliation: "Metro Heart Institute & Research Centre",
  specialties: ["Complex Angioplasty", "Transradial Interventions", "Heart Failure Management", "Valvular Heart Disease", "Cardiac Electrophysiology"],
  education: [
    { degree: "Fellowship in Cardiology", institution: "Royal College of Physicians, London", year: "2012" },
    { degree: "MD – Internal Medicine", institution: "All India Institute of Medical Sciences", year: "2005" },
  ],
  schedule: [
    { location: "Metro Heart Institute", address: "Noida, Sector 12", slots: [{ days: "Mon – Wed", time: "09:00 – 13:00" }, { days: "Fri – Sat", time: "14:00 – 18:00" }] },
    { location: "Apollo Specialty Clinics", address: "Gurgaon, Phase IV", slots: [{ days: "Thursday", time: "10:00 – 17:00" }] },
  ],
  impact: { surgeries: "5,200+", papers: 45, trustScore: 4.9 },
  testimonials: [
    { quote: "Dr. Sethi is an exceptional professional. His diagnosis was precise, and he took the time to explain the entire procedure to my family. We felt completely safe under his care.", author: "Arjun K.", context: "Patient (Coronary Stenting)" },
    { quote: "Very knowledgeable and patient. The post-operative follow-up was very thorough. Highly recommended for complex heart cases.", author: "Meena S.", context: "Patient (Valve Replacement)" },
  ],
};

export default function DoctorDetailPage() {
  const d = DOCTOR;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container-page py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/doctors" className="hover:text-slate-600">Doctors</Link>
          <ChevronRight size={12} />
          <span className="text-slate-600">{d.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl font-bold text-slate-400">
            {d.name.split(" ")[1][0]}
          </div>
          <div className="flex-1">
            <Badge variant="blue" className="mb-2">Institutional Faculty</Badge>
            <h1 className="text-2xl font-bold text-slate-900">{d.name}</h1>
            <p className="text-sm text-primary-600 font-medium">{d.title}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <GraduationCap size={14} className="text-slate-400" />
                {d.experience}
              </span>
              <span className="flex items-center gap-1 text-primary-600">
                <MapPin size={14} />
                {d.affiliation}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Book Consultation</Button>
              <Button variant="outline" size="sm">Share Profile</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5">
              <h2 className="mb-4 text-base font-semibold text-slate-800">Expertise & Qualifications</h2>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Specialized Focus</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {d.specialties.map((s) => <Badge key={s}>{s}</Badge>)}
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Academic Background</p>
              <div className="space-y-3">
                {d.education.map((e) => (
                  <div key={e.degree} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50">
                      <GraduationCap size={13} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{e.degree}</p>
                      <p className="text-xs text-slate-400">{e.institution} ({e.year})</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 text-base font-semibold text-slate-800">Patient Testimonials</h2>
              <div className="space-y-4">
                {d.testimonials.map((t) => (
                  <div key={t.author} className="rounded-md border border-slate-100 bg-slate-50 p-4">
                    <RatingStars rating={5} size="sm" />
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <p className="mt-2 text-xs font-medium text-slate-500">{t.author}, <span className="font-normal text-slate-400">{t.context}</span></p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Institutional Schedule</h3>
              <div className="space-y-4">
                {d.schedule.map((s) => (
                  <div key={s.location}>
                    <p className="flex items-center gap-1 text-xs font-semibold text-primary-600">
                      <MapPin size={11} /> {s.location}
                    </p>
                    <p className="mb-2 text-xs text-slate-400">{s.address}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {s.slots.map((sl) => (
                        <div key={sl.days} className="rounded border border-slate-200 p-2 text-center">
                          <p className="text-xs font-medium text-slate-600">{sl.days}</p>
                          <p className="text-xs text-slate-400">{sl.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                View Full Availability
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Institutional Impact</h3>
              <div className="space-y-2">
                {[
                  { label: "Surgeries Performed", val: d.impact.surgeries },
                  { label: "Research Papers", val: d.impact.papers },
                  { label: "Patient Trust Score", val: `${d.impact.trustScore}/5` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-800">{val}</span>
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
