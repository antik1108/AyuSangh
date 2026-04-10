import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">AyuSangh</p>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              Institutional healthcare discovery, powered by verified patient data.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/verification" className="hover:text-slate-700">Verification Standards</Link>
            <Link href="/methodology" className="hover:text-slate-700">Data Methodology</Link>
            <Link href="/partner" className="hover:text-slate-700">Partner Portal</Link>
            <Link href="/support" className="hover:text-slate-700">Support</Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} AyuSangh Institutional Research. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
