import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { Building2, FlaskConical, Stethoscope, Home, ArrowRight, ShieldCheck } from "lucide-react";

const FEATURED = [
  {
    id: "1",
    name: "Metropolis Institute of Health",
    type: "Multi-specialty",
    location: "Carnac District, Mumbai",
    rating: 4.4,
    reviews: 3105,
  },
  {
    id: "2",
    name: "Apex Cardiology Center",
    type: "Cardiac Care",
    location: "South Green Avenue, Bangalore",
    rating: 5.0,
    reviews: 880,
  },
  {
    id: "3",
    name: "St. Jude's Specialty Hospital",
    type: "Oncology",
    location: "Heritage Park, New Delhi",
    rating: 4.8,
    reviews: 2100,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The booking process was seamless. I found details about Metropolis's MRI wait times that weren't available anywhere else.",
    author: "Ananya Sharma",
    role: "Verified Patient",
  },
  {
    quote:
      "Choosing the right hospital for my father's surgery was stressful until we used AyuSangh. The quality ratings helped us decide with confidence.",
    author: "Rahul Verma",
    role: "Healthcare Advocate",
  },
  {
    quote:
      "I appreciate the no-clutter interface. It makes finding diagnostic labs fast and doesn't overwhelm me during medical emergencies.",
    author: "David Chen",
    role: "Community Member",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-slate-100 bg-slate-50 py-20">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Find the Right Hospital,{" "}
            <span className="text-primary-600">Not Just a Doctor</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            Access verified hospital records, clinical insights, and
            community-driven healthcare data in one secure platform.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="What do you need? (MRI, hospital, lab)"
              className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:w-40"
            />
            <Link href="/hospitals">
              <Button size="lg" className="w-full sm:w-auto">
                Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="border-b border-slate-100 py-10">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Building2, label: "Hospitals", sub: "Institutional excellence", href: "/hospitals" },
              { icon: FlaskConical, label: "Diagnostic Centres", sub: "High-precision labs", href: "/hospitals?type=diagnostic" },
              { icon: Stethoscope, label: "Clinics", sub: "Specialised care", href: "/hospitals?type=clinic" },
              { icon: Home, label: "Nursing Homes", sub: "Personalised recovery", href: "/hospitals?type=nursing" },
            ].map(({ icon: Icon, label, sub, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-5 text-center transition-shadow hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured institutions */}
      <section className="py-14">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Institutions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Leading medical facilities vetted for quality of care and patient safety.
              </p>
            </div>
            <Link
              href="/hospitals"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURED.map((h) => (
              <Link key={h.id} href={`/hospitals/${h.id}`}>
                <div className="group rounded-lg border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-md">
                  <div className="h-40 bg-slate-100 flex items-center justify-center">
                    <Building2 size={40} className="text-slate-300" />
                  </div>
                  <div className="p-4">
                    <Badge variant="blue" className="mb-2">{h.type}</Badge>
                    <h3 className="font-semibold text-slate-800 group-hover:text-primary-600">
                      {h.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">{h.location}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <RatingStars rating={h.rating} showValue />
                      <span className="text-xs text-slate-400">({h.reviews.toLocaleString()})</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t border-slate-100 bg-slate-50 py-14">
        <div className="container-page">
          <div className="mb-2 flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-primary-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
              Institutional Integrity
            </span>
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
            Verified Reviews from Real Patients
          </h2>
          <p className="mx-auto mb-10 max-w-md text-center text-sm text-slate-500">
            We use blockchain-backed identity to ensure every institutional review is
            authentic and helpful.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <p className="text-sm text-slate-600 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{t.author}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
