'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, User, Mail, Lock, MapPin, ArrowRight, Loader2, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterHospitalPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    admin: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }
  });

  const handleHospitalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, admin: { ...prev.admin, [name]: value } }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, location: { ...prev.location, [name]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/auth/register/hospital`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Hospital registered successfully! Please login.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative flex items-center justify-center">
      <Toaster position="top-center" />
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-cyan-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2rem] shadow-2xl z-10 relative">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-cyan-600 rounded-xl mb-4 shadow-lg hover:scale-105 transition-transform">
            <span className="text-white font-bold text-2xl">A</span>
          </Link>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Register Your Institution</h2>
          <p className="text-slate-500 mt-2">Join thousands of clinical providers on our digital ecosystem.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Administrator Details */}
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 pb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <span className="bg-cyan-100 text-cyan-600 p-2 rounded-lg mr-3"><User size={20}/></span>
              Administrator Credentials
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="adminFirstName">First Name</label>
                <input
                  type="text" id="adminFirstName" name="firstName" required
                  value={formData.admin.firstName} onChange={handleAdminChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="adminLastName">Last Name</label>
                <input
                  type="text" id="adminLastName" name="lastName" required
                  value={formData.admin.lastName} onChange={handleAdminChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="adminEmail">Corporate Email</label>
                <input
                  type="email" id="adminEmail" name="email" required
                  value={formData.admin.email} onChange={handleAdminChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="admin@hospital.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="adminPassword">Password</label>
                <input
                  type="password" id="adminPassword" name="password" required minLength={6}
                  value={formData.admin.password} onChange={handleAdminChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Hospital Info */}
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 pb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <span className="bg-cyan-100 text-cyan-600 p-2 rounded-lg mr-3"><Building2 size={20}/></span>
              Hospital Information
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="hospitalName">Hospital / Clinic Name</label>
                <input
                  type="text" id="hospitalName" name="name" required
                  value={formData.name} onChange={handleHospitalChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="e.g. Apollo Healthcare Center"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="hospitalDescription">Description (Optional)</label>
                <textarea
                  id="hospitalDescription" name="description" rows={3}
                  value={formData.description} onChange={handleHospitalChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium resize-none"
                  placeholder="Briefly describe your institution's specialties..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 3: Location Details */}
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 pb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <span className="bg-cyan-100 text-cyan-600 p-2 rounded-lg mr-3"><MapPin size={20}/></span>
              Location Address
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="locAddress">Street Address</label>
                <input
                  type="text" id="locAddress" name="address" required
                  value={formData.location.address} onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="123 Health Ave"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="locCity">City</label>
                <input
                  type="text" id="locCity" name="city" required
                  value={formData.location.city} onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="locState">State</label>
                <input
                  type="text" id="locState" name="state" required
                  value={formData.location.state} onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="locZip">Zip Code</label>
                <input
                  type="text" id="locZip" name="zipCode" required
                  value={formData.location.zipCode} onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="400001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="locCountry">Country</label>
                <input
                  type="text" id="locCountry" name="country" required
                  value={formData.location.country} onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition outline-none font-medium"
                  placeholder="India"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 max-w-md mx-auto">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-6 rounded-2xl transition duration-300 shadow-xl shadow-cyan-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Complete Registration <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Already registered? <Link href="/login" className="text-cyan-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
