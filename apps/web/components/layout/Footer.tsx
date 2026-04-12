import Link from "next/link";
import { Building2 } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Hospitals", href: "/hospitals" },
      { label: "Doctors", href: "/doctors" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Verification Standards", href: "/verification" },
      { label: "Data Methodology", href: "/methodology" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Partner Portal", href: "/partner" },
      { label: "Contact Support", href: "/support" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 text-sm font-bold text-primary-600">
              <Building2 size={16} />
              AyuSangh
            </Link>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-[180px]">
              Institutional healthcare discovery, powered by verified patient data.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} AyuSangh Institutional Research. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built for patients, by patients.
          </p>
        </div>
      </div>
    </footer>
  );
}
