/**
 * @ayusangh/shared-types
 *
 * Central type registry for the AyuSangh platform.
 * All shared interfaces, enums, and response shapes live here.
 * Both the API (apps/api) and the web frontend (apps/web) import from this package.
 *
 * Blueprint reference: Tech_stack.md §3.2 — "Shared types live in packages/shared-types"
 */

// ─────────────────────────────────────────────
// Re-export Prisma-generated entity types & enums
// ─────────────────────────────────────────────

export type {
  User,
  Hospital,
  Doctor,
  Review,
  Location,
  Department,
  Accreditation,
  Cost,
  CommunityPost,
  DoctorInstitution,
  Favourite,
  InstitutionImage,
  RefreshToken,
} from '@prisma/client';

export { Role, InstitutionType, ReviewStatus } from '@prisma/client';

// ─────────────────────────────────────────────
// Auth types  (was: apps/api/src/auth/types.ts)
// ─────────────────────────────────────────────

import type { Role as RoleEnum } from '@prisma/client';

/** Authenticated user with sensitive fields (passwordHash) stripped */
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}

/** JWT payload encoded into the access token */
export interface JwtPayload {
  email: string;
  /** user id */
  sub: string;
  role: RoleEnum;
  iat?: number;
  exp?: number;
}

/** Response returned by POST /auth/login */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  token_type: 'Bearer';
  user: AuthenticatedUser;
}

/** Response returned by POST /auth/refresh */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  token_type: 'Bearer';
}

// ─────────────────────────────────────────────
// Rating / Review types  (was: review/interfaces/rating-strategy.interface.ts)
// ─────────────────────────────────────────────

/** Aggregated multi-dimensional score — FR-04.2 */
export interface AggregatedScore {
  overall: number;
  cleanliness: number;
  staffBehaviour: number;
  waitTime: number;
  /** Total number of approved reviews used in the calculation */
  reviewCount: number;
}

/** Response shape for GET /reviews/hospital/:id and GET /reviews/doctor/:id */
export interface ReviewsResponse {
  reviews: ReviewSummary[];
  score: AggregatedScore;
}

/** Lightweight review shape used in list responses */
export interface ReviewSummary {
  id: string;
  text?: string | null;
  ratingOverall: number;
  ratingCleanliness: number;
  ratingStaffBehaviour: number;
  ratingWaitTime: number;
  status: string;
  adminReply?: string | null;
  createdAt: Date;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
}

// ─────────────────────────────────────────────
// Hospital / Institution types
// ─────────────────────────────────────────────

/** Hospital with its location and aggregate ratings — used in list/search responses */
export interface HospitalSummary {
  id: string;
  name: string;
  description?: string | null;
  institutionType: string;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  bookingLink?: string | null;
  services: string[];
  openingHours?: string | null;
  rating?: number | null;
  ratingCleanliness?: number | null;
  ratingStaffBehaviour?: number | null;
  ratingWaitTime?: number | null;
  profilePhoto?: string | null;
  isActive: boolean;
  location?: LocationSummary;
}

/** Location shape used in nested responses */
export interface LocationSummary {
  id?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

/** Hospital with full relations — used in GET /hospitals/:id */
export interface HospitalDetail extends HospitalSummary {
  departments: DepartmentSummary[];
  accreditations: AccreditationSummary[];
  costs: CostSummary[];
  images: InstitutionImageSummary[];
}

export interface DepartmentSummary {
  id: string;
  name: string;
}

export interface AccreditationSummary {
  id: string;
  name: string;
  issueDate: Date;
  expiryDate?: Date | null;
}

export interface CostSummary {
  id: string;
  procedureName: string;
  estimatedCost: number;
}

export interface InstitutionImageSummary {
  id: string;
  imageUrl: string;
  isProfilePhoto: boolean;
  uploadedAt: Date;
}

/** Favourite with nested hospital — used in GET /hospitals/user/favourites */
export interface FavouriteWithHospital {
  id: string;
  userId: string;
  hospitalId: string;
  addedAt: Date;
  hospital: HospitalSummary & {
    reviews: Pick<ReviewSummary, 'ratingOverall'>[];
  };
}

// ─────────────────────────────────────────────
// Doctor types
// ─────────────────────────────────────────────

/** Doctor with institutions and reviews — used in list/search responses */
export interface DoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experienceYears: number;
  bio?: string | null;
  phone?: string | null;
  profilePhoto?: string | null;
  qualifications: string[];
  consultationFee?: number | null;
  isActive: boolean;
  institutions: DoctorInstitutionSummary[];
  reviews: Pick<ReviewSummary, 'ratingOverall'>[];
}

export interface DoctorInstitutionSummary {
  id: string;
  doctorId: string;
  hospitalId: string;
  joinedAt: Date;
  hospital: Pick<HospitalSummary, 'id' | 'name'>;
}

// ─────────────────────────────────────────────
// Search types  (was: search/advanced-search.service.ts)
// ─────────────────────────────────────────────

/** Combined global search result */
export interface SearchResponse {
  hospitals?: HospitalSummary[];
  doctors?: DoctorSummary[];
}

/** Options for advanced search endpoint */
export interface AdvancedSearchOptions {
  query: string;
  type?: 'hospital' | 'doctor' | 'all';
  limit?: number;
  offset?: number;
}

/** Options for advanced hospital search */
export interface HospitalSearchOptions {
  query?: string;
  institutionType?: string;
  city?: string;
  state?: string;
  minRating?: number;
  maxRating?: number;
  limit?: number;
  offset?: number;
}

/** Options for advanced doctor search */
export interface DoctorSearchOptions {
  query?: string;
  specialization?: string;
  city?: string;
  minRating?: number;
  maxRating?: number;
  institutionId?: string;
  limit?: number;
  offset?: number;
}

/** Options for nearby search */
export interface NearbySearchOptions {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  limit?: number;
}

// ─────────────────────────────────────────────
// Community types
// ─────────────────────────────────────────────

export interface CommunityPostSummary {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Analytics types  (was: analytics/analytics.service.ts)
// ─────────────────────────────────────────────

export interface PlatformOverview {
  totalHospitals: number;
  totalDoctors: number;
  totalUsers: number;
  totalReviews: number;
  pendingReviews: number;
}

export interface HospitalStats {
  hospitalId: string;
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  favouriteCount: number;
  ratings: {
    rating?: number | null;
    ratingCleanliness?: number | null;
    ratingStaffBehaviour?: number | null;
    ratingWaitTime?: number | null;
  } | null;
}

// ─────────────────────────────────────────────
// Generic API response wrapper
// ─────────────────────────────────────────────

/** Standard envelope returned by TransformInterceptor */
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

/** Standard paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
