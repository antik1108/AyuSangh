export interface Institution {
  id: string;
  name: string;
  type: string;
  description?: string;
  city: string;
  pincode: string;
  address: string;
  phone: string;
  bookingLink?: string;
  averageRating: number;
  overallAvg: number;
  cleanlinessAvg: number;
  staffAvg: number;
  waitTimeAvg: number;
  totalReviews: number;
  isVerified: boolean;
  photos?: InstitutionPhoto[];
  doctors?: DoctorInstitution[];
  reviews?: Review[];
  location?: Location;
}

export interface InstitutionPhoto {
  id: string;
  cloudinaryUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  consultationFee: number;
  qualifications?: string;
  bio?: string;
}

export interface DoctorInstitution {
  id: string;
  doctor: Doctor;
}

export interface Review {
  id: string;
  text: string;
  overallRating: number;
  cleanlinessRating: number;
  staffRating: number;
  waitTimeRating: number;
  status: string;
  createdAt: string;
  user?: { name: string };
  reviewReplies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  text: string;
  createdAt: string;
  adminUser?: { name: string };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
