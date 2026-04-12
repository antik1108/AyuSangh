"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Star, ShieldCheck, Upload, X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const RATING_DIMENSIONS = [
  { key: "cleanliness", label: "Cleanliness", hint: "Facility hygiene and upkeep" },
  { key: "staff", label: "Staff Behaviour", hint: "Courtesy and professionalism" },
  { key: "waitTime", label: "Wait Time", hint: "Time from arrival to consultation" },
  { key: "overall", label: "Overall Experience", hint: "Your general impression" },
] as const;

type RatingKey = (typeof RATING_DIMENSIONS)[number]["key"];

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${i} stars`}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              size={22}
              className={cn(
                "transition-colors duration-100",
                i <= active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              )}
            />
          </button>
        ))}
      </div>
      {active > 0 && (
        <span className="text-xs font-medium text-slate-500">
          {RATING_LABELS[active]}
        </span>
      )}
    </div>
  );
}

export default function WriteReviewPage() {
  const router = useRouter();
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    cleanliness: 0,
    staff: 0,
    waitTime: 0,
    overall: 0,
  });
  const [content, setContent] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setRating = (key: RatingKey, val: number) =>
    setRatings((r) => ({ ...r, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allRated = Object.values(ratings).every((v) => v > 0);
    if (!allRated) {
      toast.error("Please rate all dimensions.");
      return;
    }
    if (!content.trim()) {
      toast.error("Please share your experience.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Review submitted for verification!");
    router.push("/dashboard");
  };

  const charCount = content.length;
  const minChars = 50;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container-page max-w-2xl flex-1 py-8">
        {/* Back */}
        <Link
          href="/hospitals"
          className="mb-5 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={13} />
          Back to hospitals
        </Link>

        {/* Header */}
        <div className="mb-7">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck size={11} />
            Verified Submission
          </span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 text-balance">
            Rate your experience at{" "}
            <span className="text-primary-600">
              St. Jude Institutional Medical Center
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Your feedback helps thousands of patients make informed decisions.
            Every verified review strengthens our community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating dimensions */}
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">
              Rate each dimension
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {RATING_DIMENSIONS.map(({ key, label, hint }) => (
                <div
                  key={key}
                  className={cn(
                    "rounded-xl border bg-white p-4 transition-colors",
                    ratings[key] > 0
                      ? "border-primary-200 bg-primary-50/30"
                      : "border-slate-200"
                  )}
                >
                  <p className="mb-0.5 text-sm font-medium text-slate-800">{label}</p>
                  <p className="mb-2.5 text-xs text-slate-400">{hint}</p>
                  <StarRating
                    value={ratings[key]}
                    onChange={(v) => setRating(key, v)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Text review */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800">
                Share your experience
              </label>
              <span
                className={cn(
                  "text-xs",
                  charCount < minChars ? "text-slate-400" : "text-emerald-600"
                )}
              >
                {charCount} / {minChars} min
              </span>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about the consultation, the facility, and the quality of care. Be specific — it helps other patients most."
              className="input-base resize-none"
            />
          </div>

          {/* Proof upload */}
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-800">
              Verification Proof{" "}
              <span className="text-xs font-normal text-slate-400">(optional)</span>
            </p>
            <p className="mb-3 text-xs text-slate-400">
              Upload a photo of your prescription or bill. Personal details will be
              automatically blurred before review.
            </p>
            <div className="flex gap-3">
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-primary-400 hover:text-primary-500">
                <Upload size={17} />
                <span className="mt-1 text-xs">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {proofFile && (
                <div className="relative flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
                  <span className="text-center px-2 leading-tight">
                    {proofFile.name.slice(0, 12)}…
                  </span>
                  <button
                    type="button"
                    onClick={() => setProofFile(null)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm"
                    aria-label="Remove file"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit row */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={13} className="text-primary-500" />
              Your identity remains private and secure.
            </p>
            <Button type="submit" size="lg" isLoading={isSubmitting}>
              Submit Verified Review
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
