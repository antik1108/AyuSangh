"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { ShieldCheck, Building2, User } from "lucide-react";
import { User as UserType } from "@/types";

type Role = "PATIENT" | "HOSPITAL_ADMIN";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<Role>("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password, role);
      const { accessToken, user } = res.data as { accessToken: string; user: UserType };
      login(accessToken, user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left panel — visible on sm+ */}
      <div className="hidden sm:flex sm:w-[420px] shrink-0 flex-col justify-between bg-primary-600 p-10 text-white">
        <Link href="/" className="flex items-center gap-2 text-base font-bold text-white">
          <Building2 size={18} />
          AyuSangh
        </Link>

        <div>
          <h2 className="text-2xl font-bold leading-snug text-balance">
            Connecting you to institutional healthcare excellence.
          </h2>
          <p className="mt-3 text-sm text-primary-100 leading-relaxed">
            Access verified hospital records, clinical insights, and
            community-driven healthcare data in one secure portal.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { label: "Verified Institutions", sub: "15,000+ audited medical centers" },
              { label: "Institutional Privacy", sub: "End-to-end encrypted data" },
              { label: "Real Patient Reviews", sub: "Blockchain-verified submissions" },
            ].map(({ label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary-300" />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-primary-200">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-primary-300">
          © {new Date().getFullYear()} AyuSangh Institutional Research
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-6 flex items-center gap-1.5 text-base font-bold text-primary-600 sm:hidden"
          >
            <Building2 size={16} />
            AyuSangh
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue.</p>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {(["PATIENT", "HOSPITAL_ADMIN"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-all duration-150",
                  role === r
                    ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {r === "PATIENT" ? (
                  <User size={17} className={role === r ? "text-primary-600" : "text-slate-400"} />
                ) : (
                  <Building2 size={17} className={role === r ? "text-primary-600" : "text-slate-400"} />
                )}
                {r === "PATIENT" ? "Patient" : "Hospital Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
              />
              <div className="mt-1.5 text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
