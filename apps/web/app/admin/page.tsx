"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RatingStars } from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";
import { ClipboardList, CheckCircle2, Flag, Clock, Check, X, Info } from "lucide-react";
import toast from "react-hot-toast";

type ReviewStatus = "NEW" | "IN_REVIEW" | "FLAGGED" | "VERIFIED";

interface PendingReview {
  id: string;
  author: string;
  initials: string;
  hospital: string;
  rating: number;
  content: string;
  date: string;
  location: string;
  status: ReviewStatus;
  flagReason?: string;
}

const INITIAL_REVIEWS: PendingReview[] = [
  {
    id: "r1",
    author: "John Doe",
    initials: "JD",
    hospital: "St. Mary's General Hospital",
    rating: 4.8,
    content: "The surgical staff was incredibly professional. The post-operative care exceeded my expectations. Wait times were minimal, and the diagnostic lab was efficient.",
    date: "Oct 24, 2024",
    location: "Mumbai, IN",
    status: "NEW",
  },
  {
    id: "r2",
    author: "Anita Sharma",
    initials: "AS",
    hospital: "City Diagnostic Center",
    rating: 2.5,
    content: "Report delivery was delayed by three days. No explanation was given by the front desk. The facility itself was clean, but the administrative experience was poor.",
    date: "Oct 23, 2024",
    location: "Mumbai, IN",
    status: "FLAGGED",
    flagReason: "Flagged for sensitivity",
  },
  {
    id: "r3",
    author: "Michael K.",
    initials: "MK",
    hospital: "Apollo Specialty Clinics",
    rating: 4.9,
    content: "Excellent consultation with Dr. Gupta. The diagnostic tests were integrated seamlessly...",
    date: "Oct 22, 2024",
    location: "Mumbai, IN",
    status: "VERIFIED",
  },
];

const QUEUE_FILTERS: { label: string; key: ReviewStatus | "ALL"; count: number }[] = [
  { label: "All Items", key: "ALL", count: 124 },
  { label: "New", key: "NEW", count: 42 },
  { label: "In Review", key: "IN_REVIEW", count: 56 },
  { label: "Flagged", key: "FLAGGED", count: 26 },
];

export default function AdminModerationPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<ReviewStatus | "ALL">("ALL");

  const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success(action === "APPROVE" ? "Review approved" : "Review rejected");
  };

  const filtered = activeFilter === "ALL" ? reviews : reviews.filter((r) => r.status === activeFilter);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container-page flex-1 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Platform Moderation</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage pending review verifications and institutional standards.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Pending Verifications", val: "124", icon: ClipboardList, color: "text-primary-600" },
            { label: "Processed Today", val: "48", icon: CheckCircle2, color: "text-emerald-600" },
            { label: "Flagged Content", val: "12", icon: Flag, color: "text-red-500" },
            { label: "Avg. Review Time", val: "4.2h", icon: Clock, color: "text-slate-500" },
          ].map(({ label, val, icon: Icon, color }) => (
            <Card key={label} className="p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-2xl font-bold text-slate-900">{val}</p>
                <Icon size={20} className={color} />
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden w-44 shrink-0 lg:block">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Queue Filters</p>
            <div className="space-y-1">
              {QUEUE_FILTERS.map(({ label, key, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    activeFilter === key
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <span>{label}</span>
                  <span className="text-xs text-slate-400">{count}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-700">Institutional Tip</p>
              <p className="mt-1 text-xs text-amber-600">
                Always verify the hospital stamp on the &apos;Verification Proof&apos; image before approving surgical reviews.
              </p>
            </div>
          </aside>

          {/* Queue */}
          <div className="flex-1 min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">Pending Reviews Queue</h2>
              <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                Sort by Priority
              </button>
            </div>

            <div className="space-y-3">
              {filtered.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Review content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {r.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-slate-800">{r.author}</p>
                            <span className="text-xs text-slate-400">Reviewing: {r.hospital}</span>
                            <RatingStars rating={r.rating} showValue size="sm" />
                          </div>
                          <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                            &ldquo;{r.content}&rdquo;
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                            <span>{r.date}</span>
                            <span>{r.location}</span>
                            {r.flagReason && (
                              <Badge variant="amber">{r.flagReason}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Proof + actions */}
                    <div className="flex shrink-0 items-start gap-3 sm:flex-col sm:items-end">
                      <div className="flex h-20 w-20 items-center justify-center rounded bg-slate-800 text-xs text-slate-400">
                        Proof Anonymized
                      </div>
                      {r.status !== "VERIFIED" ? (
                        <div className="flex flex-col gap-1.5">
                          <Badge variant={r.status === "NEW" ? "blue" : r.status === "FLAGGED" ? "amber" : "default"}>
                            {r.status}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleAction(r.id, "APPROVE")}
                            className="gap-1"
                          >
                            <Check size={12} /> Approve
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Info size={12} /> Info
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(r.id, "REJECT")}
                            className="gap-1 text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <X size={12} /> Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="green">
                          <CheckCircle2 size={10} className="mr-1" /> Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
