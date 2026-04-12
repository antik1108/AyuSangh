import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  FlaskConical,
  Stethoscope,
  Home,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users,
  Star,
} from "lucide-react";

const FEATURED = [
  {
    id: "1",
    name: "Metropolis Institute of Health",
    type: "Multi-specialty",
    location: "Carnac District, Mumbai",
    rating: 4.4,
    reviews: 3105,
    specialties: ["Cardiology", "Oncology", "Neurology"],
  },
  {
    id: "2",
    name: "Apex Cardiology Center",
    type: "Cardiac Care",
    location: "South Green Avenue, Bangalore",
    rating: 5.0,
    reviews: 880,
    specialties: ["Interventional Cardiology", "EP Studies"],
  },
  {
    id: "3",
    name: "St. Jude's Specialty Hospital",
    type: "Oncology",
    location: "Heritage Park, New Delhi",
    rating: 4.8,
    reviews: 2100,
    specialties: ["Radiation Therapy", "Surgical Oncology"],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I found details about Metropolis's MRI wait times that weren't available anywhere else. Made a stressful decision much easier.",
    author: "Ananya Sharma",
    role: "Verified Patient",
    initials: "AS",
  },
  {
    quote:
      "The quality ratings helped us choose the right hospital for my father's surgery. We went in with confidence instead of guesswork.",
    author: "Rahul Verma",
    role: "Healthcare Advocate",
    initials: "RV",
  },
  {
    quote:
      "Clean, fast, and doesn't overwhelm you. Exactly what you need when you're dealing with a medical emergency.",
    author: "David Chen",
    role: "Community Member",
    initials: "DC",
  },
];

const STATS = [
  { label: "Verified Institutions", value: "15,000+", icon: Building2 },
  { label: "Patient Reviews", value: "2.4M+", icon: Star },
  { label: "Active Users", value: "180,000+", icon: Users },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="border-b border-slate-100 bg-slate-50 px-4 py-16 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              <ShieldCheck size={12} />
              Blockchain-verified patient reviews
            </span>

            <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl text-balance">
              Find the right hospital,{" "}
              <span className="text-primary-600">not just a doctor</span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-base text-slate-500 leading-relaxed">
              Access verified hospital records, multi-dimensional ratings, and
              community-driven insights — all in one place.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Hospital, diagnostic lab, specialty…"
                className="input-base flex-1"
                aria-label="Search query"
              />
              <input
                type="text"
                placeholder="City"
                className="input-base sm:w-32"
                aria-label="Location"
              />
              <Link
                href="/hospitals"
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                Search
              </Link>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Popular:{" "}
              {["Apollo Mumbai", "AIIMS Delhi", "Fortis Bangalore"].map((s, i) => (
                <span key={s}>
                  <Link href="/hospitals" className="hover:text-primary-600 transition-colors">
                    {s}
                  </Link>
                  {i < 2 && <span className="mx-1.5 text-slate-300">·</span>}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-slate-100 bg-white py-5">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                  <Icon size={15} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category tiles ── */}
      <section className="border-b border-slate-100 py-12">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Building2, label: "Hospitals", sub: "Institutional excellence", href: "/hospitals" },
              { icon: FlaskConical, label: "Diagnostic Centres", sub: "High-precision labs", href: "/hospitals?type=diagnostic" },
              { icon: Stethoscope, label: "Clinics", sub: "Specialised care", href: "/hospitals?type=clinic" },
              { icon: Home, label: "Nursing Homes", sub: "Personalised recovery", href: "/hospitals?type=nursing" },
            ].map(({ icon: Icon, label, sub, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-5 text-center transition-all duration-150 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 group-hover:bg-primary-50 transition-colors">
                  <Icon size={19} className="text-slate-500 group-hover:text-primary-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured institutions ── */}
      <section className="py-14">
        <div className="container-page">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Top Rated
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Featured Institutions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Vetted for quality of care, patient safety, and outcomes.
              </p>
            </div>
            <Link
              href="/hospitals"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURED.map((h) => (
              <Link key={h.id} href={`/hospitals/${h.id}`} className="group">
                <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-150 hover:border-slate-300 hover:shadow-md">
                  {/* Image placeholder */}
                  <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                    <Building2 size={36} className="text-slate-200" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="blue">{h.type}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">
                      {h.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} />
                      {h.location}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {h.specialties.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="rounded bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <RatingStars rating={h.rating} showValue size="sm" />
                        <span className="text-xs text-slate-400">
                          ({h.reviews.toLocaleString()})
                        </span>
                      </div>
                      <span className="text-xs font-medium text-primary-600 group-hover:underline">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 text-center sm:hidden">
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600"
            >
              View all institutions <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust / testimonials ── */}
      <section className="border-t border-slate-100 bg-slate-50 py-14">
        <div className="container-page">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary-600">
              <ShieldCheck size={13} />
              Institutional Integrity
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Verified reviews from real patients
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Every review is tied to a verified visit. No fake ratings, no paid placements.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5"
              >
                {/* Quote marks */}
                <p className="mb-3 text-2xl leading-none text-slate-200 font-serif select-none">
                  &ldquo;
                </p>
                <p className="flex-1 text-sm text-slate-600 leading-relaxed -mt-2">
                  {t.quote}
                </p>
                <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{t.author}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-slate-100 py-14">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Ready to make an informed decision?
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Join 180,000+ patients who use AyuSangh to find the right care.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Create free account
            </Link>
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Browse hospitals
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
