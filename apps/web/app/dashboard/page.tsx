"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { Search, PenLine, Sparkles, Building2, CheckCircle, Clock } from "lucide-react";

const SAVED = [
  { id: "1", name: "St. Mary Memorial", location: "Indiranagar, Bangalore", type: "Hospital", rating: 4.8 },
  { id: "2", name: "Precision Care Diagnostics", location: "Whitefield, Bangalore", type: "Diag", rating: 4.6 },
  { id: "3", name: "HealthLink Hub", location: "Koramangala, Bangalore", type: "Diagnostic", rating: 4.9 },
];

const RECENT_REVIEWS = [
  { hospital: "St. Mary Memorial Hospital", status: "APPROVED", rating: 5, excerpt: "Excellent staff and very clean facilities. The cardiac department was exceptional...", date: "2 days ago" },
  { hospital: "Precision Care Diagnostics", status: "PENDING", rating: 4, excerpt: "Wait time was a bit longer than expected, but the report accuracy was top-notch...", date: "4 hours ago" },
];

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Hello, {user?.firstName}</h1>
        <p className="text-sm text-slate-500">Here is an overview of your healthcare activities.</p>
      </div>

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/hospitals">
          <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 hover:bg-primary-100 transition-colors">
            <Search size={18} className="text-primary-600 mb-2" />
            <p className="font-semibold text-slate-800">Search Hospitals</p>
            <p className="mt-0.5 text-xs text-slate-500">Discover 500+ verified medical institutions.</p>
          </div>
        </Link>
        <Link href="/reviews/write">
          <div className="rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50 transition-colors">
            <PenLine size={18} className="text-slate-600 mb-2" />
            <p className="font-semibold text-slate-800">Write a Review</p>
            <p className="mt-0.5 text-xs text-slate-500">Share your experience to help the community.</p>
          </div>
        </Link>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <Sparkles size={18} className="text-slate-600 mb-2" />
          <p className="font-semibold text-slate-800">Recommendations</p>
          <p className="mt-0.5 text-xs text-slate-500">Personalised suggestions based on your profile.</p>
        </div>
      </div>

      {/* Saved institutions */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">My Curations</p>
            <h2 className="text-base font-semibold text-slate-800">Saved Institutions</h2>
          </div>
          <Link href="/dashboard/saved" className="text-xs text-primary-600 hover:underline">View All</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {SAVED.map((h) => (
            <Link key={h.id} href={`/hospitals/${h.id}`}>
              <Card hover className="p-3">
                <div className="mb-2 h-24 rounded bg-slate-100 flex items-center justify-center">
                  <Building2 size={28} className="text-slate-300" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="blue">{h.type}</Badge>
                  <span className="text-xs text-amber-500">★ {h.rating}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{h.name}</p>
                <p className="text-xs text-slate-400">{h.location}</p>
                <Button variant="outline" size="sm" className="mt-2 w-full">View Profile</Button>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent reviews */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Transparency</p>
            <h2 className="text-base font-semibold text-slate-800">Recent Reviews</h2>
          </div>
          <Link href="/dashboard/reviews" className="text-xs text-primary-600 hover:underline">Manage Reviews</Link>
        </div>
        <div className="space-y-2">
          {RECENT_REVIEWS.map((r) => (
            <div key={r.hospital} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${r.status === "APPROVED" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-slate-800">{r.hospital}</p>
                  <Badge variant={r.status === "APPROVED" ? "green" : "amber"}>
                    {r.status === "APPROVED" ? <CheckCircle size={10} className="mr-1" /> : <Clock size={10} className="mr-1" />}
                    {r.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">&ldquo;{r.excerpt}&rdquo;</p>
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
