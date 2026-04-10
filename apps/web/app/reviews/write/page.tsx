"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Star, ShieldCheck, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const RATING_DIMENSIONS = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "staff", label: "Staff Behaviour" },
  { key: "waitTime", label: "Wait Time" },
  { key: "overall", label: "Overall Experience" },
] as const;

type RatingKey = (typeof RATING_DIMENSIONS)[number]["key"];

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            size={22}
            className={cn(
              "transition-colors",
              i <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-slate-600">
        {(hover || value).toFixed(1)}
      </span>
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
    if (!allRated) { toast.error("Please rate all dimensions."); return; }
    if (!content.trim()) { toast.error("Please share your experience."); return; }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate API
    toast.success("Review submitted for verification!");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container-page max-w-2xl flex-1 py-10">
        <div className="mb-1">
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <ShieldCheck size={11} /> Verified Submission
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Rate your experience at{" "}
          <span className="text-primary-600">St. Jude Institutional Medical Center</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Your feedback helps thousands of patients make informed healthcare decisions.
          Every verified review strengthens our community.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Rating dimensions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RATING_DIMENSIONS.map(({ key, label }) => (
              <div
                key={key}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                <StarRating value={ratings[key]} onChange={(v) => setRating(key, v)} />
              </div>
            ))}
          </div>

          {/* Text review */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Share your detailed experience
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about the consultation, the facility, and the quality of care..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Proof upload */}
          <div>
            <p className="mb-1 text-sm font-medium text-slate-700">Verification Proof</p>
            <p className="mb-3 text-xs text-slate-400">
              Upload a photo of your prescription or bill. Personal details will be automatically blurred.
            </p>
            <div className="flex gap-3">
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                <Upload size={18} />
                <span className="mt-1 text-xs">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {proofFile && (
                <div className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                  Anonymized
                  <button
                    type="button"
                    onClick={() => setProofFile(null)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={13} className="text-primary-500" />
              Your identity remains private and secure.
            </p>
            <Button type="submit" isLoading={isSubmitting}>
              Submit Verified Review
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
