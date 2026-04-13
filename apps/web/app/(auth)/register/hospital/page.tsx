"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

type HospitalForm = {
  name: string;
  description: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

export default function RegisterHospitalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<HospitalForm>({
    name: "",
    description: "",
    admin: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    },
  });

  const setHospitalField =
    (field: keyof Pick<HospitalForm, "name" | "description">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const setAdminField =
    (field: keyof HospitalForm["admin"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, admin: { ...prev.admin, [field]: value } }));
    };

  const setLocationField =
    (field: keyof HospitalForm["location"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, location: { ...prev.location, [field]: value } }));
    };

  const validate = () => {
    if (!form.name.trim()) return "Hospital name is required";
    if (!form.admin.firstName.trim()) return "Admin first name is required";
    if (!form.admin.lastName.trim()) return "Admin last name is required";
    if (!/\S+@\S+\.\S+/.test(form.admin.email)) return "Valid admin email is required";
    if (form.admin.password.length < 6) return "Password must be at least 6 characters";
    if (!form.location.address.trim()) return "Address is required";
    if (!form.location.city.trim()) return "City is required";
    if (!form.location.state.trim()) return "State is required";
    if (!form.location.zipCode.trim()) return "Zip code is required";
    if (!form.location.country.trim()) return "Country is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.registerHospital(form);
      toast.success("Hospital admin created. Please login.");
      router.push("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Hospital registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <Link href="/" className="mb-6 flex items-center gap-1.5 text-base font-bold text-primary-600">
          <Building2 size={16} />
          AyuSangh
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Hospital Admin Registration</h1>
          <p className="mt-1 text-sm text-slate-500">Create institution and admin account in one step.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input label="Institution name" placeholder="Apollo Hospital" value={form.name} onChange={setHospitalField("name")} />
            <Input label="Description" placeholder="Optional" value={form.description} onChange={setHospitalField("description")} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Admin first name" value={form.admin.firstName} onChange={setAdminField("firstName")} />
              <Input label="Admin last name" value={form.admin.lastName} onChange={setAdminField("lastName")} />
              <Input label="Admin email" type="email" value={form.admin.email} onChange={setAdminField("email")} />
              <Input label="Admin password" type="password" value={form.admin.password} onChange={setAdminField("password")} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Address" value={form.location.address} onChange={setLocationField("address")} />
              <Input label="City" value={form.location.city} onChange={setLocationField("city")} />
              <Input label="State" value={form.location.state} onChange={setLocationField("state")} />
              <Input label="Zip code" value={form.location.zipCode} onChange={setLocationField("zipCode")} />
              <Input label="Country" value={form.location.country} onChange={setLocationField("country")} />
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create hospital admin account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
