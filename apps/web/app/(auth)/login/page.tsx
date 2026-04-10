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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid sm:grid-cols-2">
          {/* Left panel */}
          <div className="flex flex-col justify-between bg-primary-600 p-8 text-white">
            <div>
              <p className="text-xl font-bold">AyuSangh</p>
              <h2 className="mt-6 text-2xl font-bold leading-snug">
                Connecting you to institutional healthcare excellence.
              </h2>
              <p className="mt-3 text-sm text-primary-100">
                Access verified hospital records, clinical insights, and
                community-driven healthcare data in one secure portal.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {[
                { icon: ShieldCheck, label: "Verified Institutions", sub: "15,000+ audited medical centers" },
                { icon: ShieldCheck, label: "Institutional Privacy", sub: "End-to-end encrypted data" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={16} className="mt-0.5 shrink-0 text-primary-200" />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-primary-200">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="p-8">
            <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">
              Select your role to continue.
            </p>

            {/* Role selector */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {(["PATIENT", "HOSPITAL_ADMIN"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-colors",
                    role === r
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  {r === "PATIENT" ? <User size={18} /> : <Building2 size={18} />}
                  {r === "PATIENT" ? "I am a Patient" : "Hospital Admin"}
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
              />
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />
                <div className="mt-1 text-right">
                  <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
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
    </div>
  );
}
