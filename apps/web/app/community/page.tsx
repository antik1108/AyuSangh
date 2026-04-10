import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThumbsUp, MessageSquare, Bookmark, MapPin, Tag, TrendingUp } from "lucide-react";

const POSTS = [
  {
    id: "p1",
    author: "Dr. Ananya Sharma",
    role: "Verified Practitioner",
    time: "2h ago",
    category: "General Advice",
    title: "Understanding Post-Op Cardiac Care Protocols in Multi-Specialty Centers",
    excerpt:
      "Most patients wonder about the transition from ICU to ward. It's critical to monitor the fluid intake and early mobilization protocols. Based on recent data from AyuSangh research...",
    tags: ["Apollo Hospitals, Bangalore", "Cardiology"],
    likes: 142,
    comments: 28,
  },
  {
    id: "p2",
    author: "Rajesh Varma",
    role: "Community Member",
    time: "5h ago",
    category: "Hospital Experiences",
    title: "Wait times at Manipal Hospital Diagnostics: My Experience",
    excerpt:
      "Had an MRI scheduled for 10 AM. The facility was incredibly clean but the intake process took longer than expected. Here's a tip for anyone going there next week...",
    tags: ["Manipal Hospital, Old Airport Road"],
    likes: 56,
    comments: 12,
  },
];

const TRENDING = [
  { name: "Medanta The Medicity", discussions: 154 },
  { name: "Cloudnine Fertility", discussions: 69 },
  { name: "Aster CMI Hospital", discussions: 212 },
];

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container-page flex-1 py-8">
        <div className="flex gap-6">
          {/* Left sidebar */}
          <aside className="hidden w-44 shrink-0 lg:block">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</p>
            <div className="space-y-0.5">
              {["General Advice", "Hospital Experiences", "Recovery Stories"].map((c) => (
                <button
                  key={c}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 text-left"
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-md border border-primary-200 bg-primary-50 p-3">
              <p className="text-xs font-semibold text-primary-700">Verified Experts</p>
              <p className="mt-1 text-xs text-primary-600">
                Connect with institutional research leads and medical staff.
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full text-xs">
                View Directory
              </Button>
            </div>
          </aside>

          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="mb-4 flex items-center gap-1 border-b border-slate-200">
              {["Trending", "Latest", "Top Voted"].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    i === 0
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {POSTS.map((p) => (
                <Card key={p.id} className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {p.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.author}</p>
                      <p className="text-xs text-slate-400">{p.role} · {p.time}</p>
                    </div>
                    <Badge variant="blue" className="ml-auto">{p.category}</Badge>
                  </div>

                  <h3 className="font-semibold text-slate-900 leading-snug">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.excerpt}</p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1 text-xs text-slate-400">
                        {t.includes(",") ? <MapPin size={10} /> : <Tag size={10} />}
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                    <button className="flex items-center gap-1 hover:text-slate-600">
                      <ThumbsUp size={13} /> {p.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-slate-600">
                      <MessageSquare size={13} /> {p.comments} Comments
                    </button>
                    <button className="ml-auto hover:text-slate-600">
                      <Bookmark size={13} />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Featured story */}
              <div className="rounded-lg border border-primary-200 bg-primary-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
                  Featured Recovery Story
                </p>
                <h3 className="font-bold text-slate-900">Back to the Marathon: Knee Replacement at 60</h3>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                  &ldquo;I never thought I&apos;d run again. But thanks to the robotic-assisted surgery at Fortis and the rehabilitation community here at AyuSangh, I&apos;ve just completed my first 5K...&rdquo;
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  Read Full Journey
                </Button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="hidden w-48 shrink-0 xl:block">
            <Card className="p-4 mb-4">
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp size={13} className="text-slate-500" />
                <p className="text-xs font-semibold text-slate-700">Trending Institutions</p>
              </div>
              <div className="space-y-2">
                {TRENDING.map((t) => (
                  <div key={t.name} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.discussions} active discussions</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/hospitals" className="mt-3 block text-xs text-primary-600 hover:underline">
                See Institution Rankings
              </Link>
            </Card>

            <Card className="p-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Guidelines</p>
              <ul className="space-y-1.5">
                {[
                  "Keep advice evidence-based or clearly mark as personal experience.",
                  "Avoid sharing sensitive PII.",
                ].map((g) => (
                  <li key={g} className="flex items-start gap-1.5 text-xs text-slate-500">
                    <span className="mt-0.5 text-emerald-500">✓</span>
                    {g}
                  </li>
                ))}
              </ul>
            </Card>

            <Button className="mt-4 w-full" size="sm">
              + Ask a Question
            </Button>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
