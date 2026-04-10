"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bookmark,
  Star,
  Calendar,
  Settings,
  BarChart2,
  UserCircle,
  Image,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useEffect } from "react";

const PATIENT_NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Saved Hospitals", href: "/dashboard/saved", icon: Bookmark },
  { label: "My Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { label: "Profile Settings", href: "/dashboard/settings", icon: Settings },
];

const ADMIN_NAV = [
  { label: "Analytics", href: "/dashboard", icon: BarChart2 },
  { label: "Manage Profile", href: "/dashboard/profile", icon: UserCircle },
  { label: "Image Gallery", href: "/dashboard/gallery", icon: Image },
  { label: "Review Management", href: "/dashboard/reviews", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const nav = user.role === "HOSPITAL_ADMIN" ? ADMIN_NAV : PATIENT_NAV;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="border-b border-slate-200 px-4 py-4">
          <Link href="/" className="text-base font-bold text-primary-600">
            AyuSangh
          </Link>
          {user.role === "HOSPITAL_ADMIN" && (
            <p className="text-xs text-slate-400 mt-0.5">Institutional Admin</p>
          )}
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
              {user.firstName?.[0] ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
