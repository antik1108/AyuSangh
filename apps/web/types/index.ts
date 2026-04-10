export type UserRole = "PATIENT" | "HOSPITAL_ADMIN" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Hospital {
  id: string;
  name: string;
  description: string;
  type: "MULTI_SPECIALTY" | "DIAGNOSTIC" | "CLINIC" | "GOVERNMENT";
  location: Location;
  distance?: string;
  ratings: HospitalRatings;
  services: string[];
  isVerified: boolean;
  imageUrl?: string;
}

export interface HospitalRatings {
  overall: number;
  cleanliness: number;
  staff: number;
  waitTime: number;
  facility: number;
  totalReviews: number;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experienceYears: number;
  hospitalAffiliation?: string;
  imageUrl?: string;
  patientTrustScore?: number;
}

export interface Review {
  id: string;
  authorName: string;
  authorInitials: string;
  hospitalName: string;
  hospitalId: string;
  rating: number;
  content: string;
  date: string;
  isVerified: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";
}

export interface AuthTokens {
  accessToken: string;
}
