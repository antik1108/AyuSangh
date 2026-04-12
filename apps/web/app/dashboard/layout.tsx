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
  Building2,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  const nav = user.role === "HOSPITAL_ADMIN" ? ADMIN_NAV : PATIENT_NAV;

  const SidebarContent = () => (
    <>
      <div className="border-b border-slate-200 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-bold text-primary-600"
        >
          <Building2 size={16} />
          AyuSangh
        </Link>
        <p className="mt-0.5 text-xs text-slate-400">
          {user.role === "HOSPITAL_ADMIN" ? "Institutional Admin" : "Patient Portal"}
        </p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
              pathname === href
                ? "bg-primary-50 text-primary-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon size={15} className="shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2.5 mb-2 px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {user.firstName?.[0]?.toUpperCase() ?? "U"}
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
          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-56 flex flex-col border-r border-slate-200 bg-white shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-bold text-primary-600">
            <Building2 size={16} />
            AyuSangh
          </Link>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {user.firstName?.[0]?.toUpperCase() ?? "U"}
          </div>
        </div>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
