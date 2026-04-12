import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  login: (email: string, password: string, role: string) =>
    api.post("/auth/login", { email, password, role }),
  registerPatient: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post("/auth/register/patient", data),
  registerHospital: (data: unknown) =>
    api.post("/auth/register/hospital", data),
};

// Hospitals
export const hospitalsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get("/hospitals", { params }),
  getById: (id: string) => api.get(`/hospitals/${id}`),
  search: (query: string, location?: string) =>
    api.get("/search", { params: { q: query, location } }),
};

// Doctors
export const doctorsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get("/doctors", { params }),
  getById: (id: string) => api.get(`/doctors/${id}`),
};

// Reviews
export const reviewsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get("/reviews", { params }),
  submit: (data: unknown) => api.post("/reviews", data),
  moderate: (id: string, action: "APPROVE" | "REJECT") =>
    api.patch(`/reviews/${id}/moderate`, { action }),
};
