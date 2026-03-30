'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      toast.success('Login successful! Redirecting...');
      // Normally, save JWT to cookies or context here.
      setTimeout(() => router.push('/'), 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-100 blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-3xl shadow-2xl z-10 relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-6 shadow-xl hover:scale-105 transition-transform">
            <span className="text-white font-black text-3xl">A</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition duration-300 outline-none text-slate-800 placeholder-slate-400 font-medium shadow-sm hover:border-blue-300 focus:bg-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition duration-300 outline-none text-slate-800 placeholder-slate-400 font-medium shadow-sm hover:border-blue-300 focus:bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl transition duration-300 shadow-xl shadow-blue-200/50 active:scale-95 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 font-medium">
            Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline hover:text-blue-700 ml-1">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
