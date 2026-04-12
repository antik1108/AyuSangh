"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import {
  Search,
  PenLine,
  Sparkles,
  Building2,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

const SAVED = [
  { id: "1", name: "St. Mary Memorial", location: "Indiranagar, Bangalore", type: "Hospital", rating: 4.8 },
  { id: "2", name: "Precision Care Diagnostics", location: "Whitefield, Bangalore", type: "Diagnostic", rating: 4.6 },
  { id: "3", name: "HealthLink Hub", location: "Koramangala, Bangalore", type: "Diagnostic", rating: 4.9 },
];

const RECENT_REVIEWS = [
  {
    hospital: "St. Mary Memorial Hospital",
    status: "APPROVED",
    rating: 5,
    excerpt: "Excellent staff and very clean facilities. The cardiac department was exceptional in their care.",
    date: "2 days ago",
  },
  {
    hospital: "Precision Care Diagnostics",
    status: "PENDING",
    rating: 4,
    excerpt: "Wait time was a bit longer than expected, but the report accuracy was top-notch.",
    date: "4 hours ago",
  },
];

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-5 sm:p-7 max-w-4xl">
      {/* ── Header ── */}
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">
          Hello, {user?.firstName ?? "there"} 👋
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Here&apos;s an overview of your healthcare activity.
        </p>
      </div>

      {/* ── Quick actions ── */}
      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/hospitals">
          <div className="group rounded-xl border border-primary-200 bg-primary-50 p-4 transition-colors hover:bg-primary-100">
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors">
              <Search size={16} className="text-primary-600" />
            </div>
            <p className="font-semibold text-slate-800">Search Hospitals</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Discover 500+ verified medical institutions.
            </p>
          </div>
        </Link>

        <Link href="/reviews/write">
          <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
              <PenLine size={16} className="text-slate-600" />
            </div>
            <p className="font-semibold text-slate-800">Write a Review</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Share your experience to help the community.
            </p>
          </div>
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-4 opacity-70">
          <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <Sparkles size={16} className="text-slate-500" />
          </div>
          <p className="font-semibold text-slate-800">Recommendations</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Personalised suggestions — coming soon.
          </p>
        </div>
      </div>

      {/* ── Saved institutions ── */}
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              My Curations
            </p>
            <h2 className="text-base font-semibold text-slate-900">Saved Institutions</h2>
          </div>
          <Link
            href="/dashboard/saved"
            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {SAVED.map((h) => (
            <Link key={h.id} href={`/hospitals/${h.id}`}>
              <Card hover className="p-3">
                <div className="mb-2.5 h-20 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <Building2 size={24} className="text-slate-200" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="blue">{h.type}</Badge>
                  <span className="text-xs font-medium text-amber-500">★ {h.rating}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{h.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{h.location}</p>
                <Button variant="outline" size="sm" className="mt-2.5 w-full">
                  View Profile
                </Button>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent reviews ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Transparency
            </p>
            <h2 className="text-base font-semibold text-slate-900">Recent Reviews</h2>
          </div>
          <Link
            href="/dashboard/reviews"
            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
          >
            Manage <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-2">
          {RECENT_REVIEWS.map((r) => (
            <div
              key={r.hospital}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
            >
              <div
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  r.status === "APPROVED" ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-slate-800">{r.hospital}</p>
                  <Badge variant={r.status === "APPROVED" ? "green" : "amber"}>
                    {r.status === "APPROVED" ? (
                      <CheckCircle size={10} className="mr-1" />
                    ) : (
                      <Clock size={10} className="mr-1" />
                    )}
                    {r.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                  &ldquo;{r.excerpt}&rdquo;
                </p>
              </div>
              <div className="shrink-0 text-right">
                <RatingStars rating={r.rating} size="sm" />
                <p className="mt-0.5 text-xs text-slate-400">{r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
