import Link from 'next/link';
import { User, Building2, ArrowRight } from 'lucide-react';

export default function RegisterSelectionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-100 blur-3xl opacity-60 animate-pulse"></div>
      </div>

      <div className="max-w-4xl w-full z-10 relative">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-6 shadow-lg hover:scale-105 transition-transform">
            <span className="text-white font-bold text-2xl">A</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Join AyuSangh
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Select how you would like to use our platform today. Whether you are finding care or providing it, we have you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          {/* Patient Card */}
          <Link href="/register/user" className="group relative bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl border border-blue-100"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <User size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">I am a Patient</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Find highly-rated hospitals, book doctors, and read transparent reviews to make informed healthcare decisions.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                Sign up as Patient <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Hospital Card */}
          <Link href="/register/hospital" className="group relative bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl border border-cyan-100"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <Building2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">I represent a Hospital</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                List your hospital, manage departments, connect with patients, and build a stellar online reputation.
              </p>
              <div className="flex items-center text-cyan-600 font-semibold group-hover:translate-x-2 transition-transform">
                Register Hospital <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center mt-12 text-slate-500">
          Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Log in instead</Link>
        </p>
      </div>
    </div>
  );
}
