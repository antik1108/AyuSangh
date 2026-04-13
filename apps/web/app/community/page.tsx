"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { communityApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Plus, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

interface ApiPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
  };
}

function authorName(author: ApiPost["author"]) {
  return [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email;
}

function authorInitials(author: ApiPost["author"]) {
  const name = authorName(author);
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommunityPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    communityApi.list()
      .then((res) => {
        const raw = (res.data as { data: ApiPost[] }).data;
        setPosts(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setError("Failed to load posts. Make sure the API is running."))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { router.push("/login"); return; }
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await communityApi.create(form);
      const newPost = (res.data as { data: ApiPost }).data;
      setPosts((prev) => [newPost, ...prev]);
      setForm({ title: "", content: "" });
      setShowForm(false);
      toast.success("Post published!");
    } catch {
      toast.error("Failed to publish post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="container-page py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Community</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Real experiences from real patients and practitioners.
              </p>
            </div>
            <Button size="sm" onClick={() => {
              if (!token) { router.push("/login"); return; }
              setShowForm((v) => !v);
            }}>
              <Plus size={14} />
              {showForm ? "Cancel" : "New Post"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container-page flex-1 py-7">
        <div className="flex gap-6">
          {/* Left sidebar */}
          <aside className="hidden w-44 shrink-0 lg:block">
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-3.5">
              <p className="text-xs font-semibold text-primary-700">Community Guidelines</p>
              <ul className="mt-2 space-y-1.5">
                {[
                  "Keep advice evidence-based.",
                  "Avoid sharing personal info.",
                  "Be respectful to all members.",
                ].map((g) => (
                  <li key={g} className="flex items-start gap-1.5 text-xs text-primary-600">
                    <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* New post form */}
            {showForm && (
              <Card className="mb-5 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">Create a Post</h3>
                <form onSubmit={handlePost} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <textarea
                    placeholder="Share your experience or question..."
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    required
                    rows={4}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" isLoading={submitting}>
                      Publish
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No posts yet"
                description="Be the first to share your experience."
                action={user ? { label: "Write a post", onClick: () => setShowForm(true) } : { label: "Sign in to post", onClick: () => router.push("/login") }}
              />
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <Card key={p.id} className="p-4 transition-shadow hover:shadow-sm">
                    <div className="mb-3 flex items-start gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {authorInitials(p.author)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-sm font-medium text-slate-800">{authorName(p.author)}</p>
                          {p.author.role === "DOCTOR" && (
                            <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600">
                              Verified Practitioner
                            </span>
                          )}
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs text-slate-400">{timeAgo(p.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900 leading-snug">{p.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {p.content}
                    </p>

                    <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare size={13} />
                        {new Date(p.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="hidden w-48 shrink-0 xl:block">
            <Card className="p-4">
              <div className="mb-3 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">Explore</p>
              </div>
              <div className="space-y-2">
                <Link href="/hospitals" className="block text-xs text-primary-600 hover:underline">
                  Browse Hospitals →
                </Link>
                <Link href="/doctors" className="block text-xs text-primary-600 hover:underline">
                  Find Doctors →
                </Link>
                <Link href="/reviews/write" className="block text-xs text-primary-600 hover:underline">
                  Write a Review →
                </Link>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
