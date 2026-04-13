import axios from "axios";
import type {
  ApiResponse,
  HospitalSummary,
  HospitalDetail,
  DoctorSummary,
  SearchResponse,
  ReviewsResponse,
  FavouriteWithHospital,
  LoginResponse,
  CommunityPostSummary,
  PlatformOverview,
  HospitalStats,
} from "@ayusangh/shared-types";

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

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", { email, password }),

  registerPatient: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post<ApiResponse<{ id: string }>>("/auth/register/user", data),

  registerHospital: (data: unknown) =>
    api.post<ApiResponse<unknown>>("/auth/register/hospital", data),

  refresh: (refresh_token: string) =>
    api.post<ApiResponse<LoginResponse>>("/auth/refresh", { refresh_token }),

  logout: (refresh_token: string) =>
    api.post<ApiResponse<{ message: string }>>("/auth/logout", { refresh_token }),
};

// ─── Hospitals ───────────────────────────────────────────────────────────────

export const hospitalsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<ApiResponse<HospitalSummary[]>>("/hospitals", { params }),

  getById: (id: string) =>
    api.get<ApiResponse<HospitalDetail>>(`/hospitals/${id}`),

  update: (id: string, data: Partial<{
    name: string;
    description: string;
    phone: string;
    bookingLink: string;
    website: string;
    email: string;
    openingHours: string;
    institutionType: string;
    services: string[];
  }>) => api.patch<ApiResponse<HospitalSummary>>(`/hospitals/${id}`, data),

  addFavourite: (hospitalId: string) =>
    api.post<ApiResponse<{ id: string }>>(`/hospitals/${hospitalId}/favourite`),

  removeFavourite: (hospitalId: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/hospitals/${hospitalId}/favourite`),

  isFavourite: (hospitalId: string) =>
    api.get<ApiResponse<{ isFavourite: boolean }>>(`/hospitals/${hospitalId}/is-favourite`),

  getFavourites: () =>
    api.get<ApiResponse<FavouriteWithHospital[]>>("/hospitals/user/favourites"),
};

// ─── Doctors ─────────────────────────────────────────────────────────────────

export const doctorsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<ApiResponse<DoctorSummary[]>>("/doctors", { params }),

  getById: (id: string) =>
    api.get<ApiResponse<DoctorSummary>>(`/doctors/${id}`),
};

// ─── Search ──────────────────────────────────────────────────────────────────

export const searchApi = {
  global: (query: string) =>
    api.get<ApiResponse<SearchResponse>>("/search", { params: { q: query } }),

  advanced: (params: Record<string, string | number>) =>
    api.get<ApiResponse<SearchResponse>>("/search/advanced", { params }),

  hospitals: (params: Record<string, string | number>) =>
    api.get<ApiResponse<HospitalSummary[]>>("/search/hospitals/advanced", { params }),

  doctors: (params: Record<string, string | number>) =>
    api.get<ApiResponse<DoctorSummary[]>>("/search/doctors/advanced", { params }),

  nearby: (lat: number, lng: number, radiusKm?: number) =>
    api.get<ApiResponse<HospitalSummary[]>>("/search/hospitals/nearby", {
      params: { lat, lng, radius: radiusKm },
    }),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviewsApi = {
  forHospital: (id: string) =>
    api.get<ApiResponse<ReviewsResponse>>(`/reviews/hospital/${id}`),

  forDoctor: (id: string) =>
    api.get<ApiResponse<ReviewsResponse>>(`/reviews/doctor/${id}`),

  submit: (data: {
    ratingOverall: number;
    ratingCleanliness: number;
    ratingStaffBehaviour: number;
    ratingWaitTime: number;
    text?: string;
    hospitalId?: string;
    doctorId?: string;
  }) => api.post<ApiResponse<{ id: string }>>("/reviews", data),

  update: (id: string, data: Partial<{
    ratingOverall: number;
    ratingCleanliness: number;
    ratingStaffBehaviour: number;
    ratingWaitTime: number;
    text: string;
  }>) => api.put<ApiResponse<{ id: string }>>(`/reviews/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/reviews/${id}`),

  getPending: () =>
    api.get<ApiResponse<ReviewsResponse>>("/reviews/pending"),

  approve: (id: string) =>
    api.post<ApiResponse<{ id: string }>>(`/reviews/${id}/approve`),

  reject: (id: string) =>
    api.post<ApiResponse<{ id: string }>>(`/reviews/${id}/reject`),

  reply: (id: string, replyText: string) =>
    api.post<ApiResponse<{ id: string }>>(`/reviews/${id}/reply`, { replyText }),
};

// ─── Community ───────────────────────────────────────────────────────────────

export const communityApi = {
  list: () =>
    api.get<ApiResponse<CommunityPostSummary[]>>("/community"),

  create: (data: { title: string; content: string }) =>
    api.post<ApiResponse<CommunityPostSummary>>("/community", data),
};

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analyticsApi = {
  overview: () =>
    api.get<ApiResponse<PlatformOverview>>("/analytics/overview"),

  topHospitals: (limit?: number) =>
    api.get<ApiResponse<HospitalSummary[]>>("/analytics/top-hospitals", {
      params: limit ? { limit } : undefined,
    }),

  hospitalStats: (id: string) =>
    api.get<ApiResponse<HospitalStats>>(`/analytics/hospital/${id}`),
};
