import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThumbsUp, MessageSquare, Bookmark, MapPin, TrendingUp, Plus } from "lucide-react";

const POSTS = [
  {
    id: "p1",
    author: "Dr. Ananya Sharma",
    authorInitials: "AS",
    role: "Verified Practitioner",
    time: "2h ago",
    category: "General Advice",
    categoryVariant: "blue" as const,
    title: "Understanding Post-Op Cardiac Care Protocols in Multi-Specialty Centers",
    excerpt:
      "Most patients wonder about the transition from ICU to ward. It's critical to monitor fluid intake and early mobilization protocols. Based on recent AyuSangh research data...",
    tags: [{ label: "Apollo Hospitals, Bangalore", type: "hospital" }, { label: "Cardiology", type: "topic" }],
    likes: 142,
    comments: 28,
  },
  {
    id: "p2",
    author: "Rajesh Varma",
    authorInitials: "RV",
    role: "Community Member",
    time: "5h ago",
    category: "Hospital Experiences",
    categoryVariant: "default" as const,
    title: "Wait times at Manipal Hospital Diagnostics: My Experience",
    excerpt:
      "Had an MRI scheduled for 10 AM. The facility was incredibly clean but the intake process took longer than expected. Here's a tip for anyone going there next week...",
    tags: [{ label: "Manipal Hospital, Old Airport Road", type: "hospital" }],
    likes: 56,
    comments: 12,
  },
];

const TRENDING = [
  { name: "Medanta The Medicity", discussions: 154 },
  { name: "Cloudnine Fertility", discussions: 69 },
  { name: "Aster CMI Hospital", discussions: 212 },
];

const CATEGORIES = ["General Advice", "Hospital Experiences", "Recovery Stories"];

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* ── Page header ── */}
      <div className="border-b border-slate-100 bg-white">
        <div className="container-page py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Community</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Real experiences from real patients and practitioners.
              </p>
            </div>
            <Button size="sm">
              <Plus size={14} />
              Ask a Question
            </Button>
          </div>
        </div>
      </div>

      <div className="container-page flex-1 py-7">
        <div className="flex gap-6">
          {/* ── Left sidebar ── */}
          <aside className="hidden w-44 shrink-0 lg:block">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Categories
            </p>
            <div className="space-y-0.5">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors text-left ${
                    i === 0
                      ? "bg-primary-50 font-medium text-primary-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50 p-3.5">
              <p className="text-xs font-semibold text-primary-700">Verified Experts</p>
              <p className="mt-1 text-xs text-primary-600 leading-relaxed">
                Connect with institutional research leads and medical staff.
              </p>
              <Button size="sm" variant="outline" className="mt-2.5 w-full text-xs">
                View Directory
              </Button>
            </div>
          </aside>

          {/* ── Main feed ── */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="mb-5 flex items-center gap-0 border-b border-slate-200">
              {["Trending", "Latest", "Top Voted"].map((tab, i) => (
                <button
                  key={tab}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                    i === 0
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {POSTS.map((p) => (
                <Card key={p.id} className="p-4 transition-shadow hover:shadow-sm">
                  {/* Author row */}
                  <div className="mb-3 flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {p.authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-medium text-slate-800">{p.author}</p>
                        <span className="text-xs text-slate-400">{p.role}</span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{p.time}</span>
                      </div>
                    </div>
                    <Badge variant={p.categoryVariant}>{p.category}</Badge>
                  </div>

                  <h3 className="font-semibold text-slate-900 leading-snug hover:text-primary-600 cursor-pointer transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {p.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t.label}
                        className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-500"
                      >
                        {t.type === "hospital" && <MapPin size={10} />}
                        {t.label}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <button className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                      <ThumbsUp size={13} />
                      {p.likes}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-slate-600 transition-colors">
                      <MessageSquare size={13} />
                      {p.comments} Comments
                    </button>
                    <button className="ml-auto hover:text-slate-600 transition-colors">
                      <Bookmark size={13} />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Featured story */}
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">
                  Featured Recovery Story
                </p>
                <h3 className="font-bold text-slate-900 text-base">
                  Back to the Marathon: Knee Replacement at 60
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-2">
                  &ldquo;I never thought I&apos;d run again. But thanks to the robotic-assisted
                  surgery at Fortis and the rehabilitation community here at AyuSangh,
                  I&apos;ve just completed my first 5K...&rdquo;
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  Read Full Journey
                </Button>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="hidden w-48 shrink-0 xl:block">
            <Card className="p-4 mb-4">
              <div className="mb-3 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">Trending Institutions</p>
              </div>
              <div className="space-y-2.5">
                {TRENDING.map((t, i) => (
                  <div key={t.name} className="flex items-start gap-2">
                    <span className="mt-0.5 text-xs font-bold text-slate-300 w-3 shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-slate-700 leading-tight">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400">{t.discussions} discussions</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/hospitals"
                className="mt-3 block text-xs font-medium text-primary-600 hover:underline"
              >
                See all rankings →
              </Link>
            </Card>

            <Card className="p-4">
              <p className="mb-2.5 text-xs font-semibold text-slate-700">Community Guidelines</p>
              <ul className="space-y-2">
                {[
                  "Keep advice evidence-based or clearly mark as personal experience.",
                  "Avoid sharing sensitive personal information.",
                ].map((g) => (
                  <li key={g} className="flex items-start gap-1.5 text-xs text-slate-500">
                    <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                    {g}
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// cn helper inline since this is a server component
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
