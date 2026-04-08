# AyuSangh — Frontend Developer Guide

## What is AyuSangh?

AyuSangh is a **Digital Healthcare Discovery & Institutional Rating Platform**. Patients use it to find hospitals and doctors, read verified reviews, check procedure costs, and save favourites. Hospitals use it to manage their profile and respond to reviews.

---

## Tech Stack (Frontend)

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2.1 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling |
| Lucide React | ^1.7 | Icons |
| React Hot Toast | ^2.6 | Notifications/toasts |

Package manager: **pnpm** (do not use npm or yarn)

---

## Project Structure

The frontend lives at `apps/web/src/app/` and uses Next.js **App Router**.

```
apps/web/src/app/
├── layout.tsx              ← root layout (already done)
├── globals.css             ← global styles (already done)
├── page.tsx                ← Home / Search page (already done)
├── login/
│   └── page.tsx            ← Login page (already done)
├── register/
│   └── page.tsx            ← Register type selection (already done)
│   ├── user/
│   │   └── page.tsx        ← Patient registration (NEEDS BUILDING)
│   └── hospital/
│       └── page.tsx        ← Hospital registration (NEEDS BUILDING)
├── hospitals/
│   ├── page.tsx            ← Hospital listing / search results (NEEDS BUILDING)
│   └── [id]/
│       └── page.tsx        ← Hospital detail page (NEEDS BUILDING)
├── doctors/
│   ├── page.tsx            ← Doctor listing / search results (NEEDS BUILDING)
│   └── [id]/
│       └── page.tsx        ← Doctor detail page (NEEDS BUILDING)
├── dashboard/
│   ├── page.tsx            ← Patient dashboard (NEEDS BUILDING)
│   ├── favourites/
│   │   └── page.tsx        ← Saved favourites (NEEDS BUILDING)
│   └── my-reviews/
│       └── page.tsx        ← Patient's own reviews (NEEDS BUILDING)
├── hospital-admin/
│   ├── page.tsx            ← Hospital admin dashboard (NEEDS BUILDING)
│   └── reviews/
│       └── page.tsx        ← Manage & reply to reviews (NEEDS BUILDING)
├── admin/
│   └── reviews/
│       └── page.tsx        ← Platform admin — moderate reviews (NEEDS BUILDING)
└── community/
    └── page.tsx            ← Community posts feed (NEEDS BUILDING)
```

---

## API Base URL

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

All API calls go to this base URL. The backend runs on port **3001** locally (see `.env`).

---

## Authentication

The backend uses **JWT Bearer tokens** with refresh token rotation.

After login, store these in `localStorage` or a cookie:
- `access_token` — short-lived (8h), send as `Authorization: Bearer <token>` header
- `refresh_token` — long-lived (7 days), use to get a new access token

### Auth Endpoints

```
POST /auth/login
Body: { email, password }
Response: { access_token, refresh_token, expires_in, token_type, user }

POST /auth/register/user
Body: { email, password, firstName, lastName }
Response: { id, email, firstName, lastName, role }

POST /auth/register/hospital
Body: {
  name,
  description,
  admin: { email, password, firstName, lastName },
  location: { address, city, state, zipCode, country }
}

POST /auth/refresh
Body: { refresh_token }
Response: { access_token, refresh_token, expires_in, token_type }

POST /auth/logout          ← requires Bearer token
Body: { refresh_token }
```

### User Roles

| Role | Who |
|---|---|
| `PATIENT` | Regular users browsing and reviewing |
| `HOSPITAL_ADMIN` | Hospital representative managing their profile |
| `PLATFORM_ADMIN` | Internal admin moderating the platform |
| `DOCTOR` | Doctor managing their own profile |

---

## Pages to Build

### 1. `/register/user` — Patient Registration

Form fields: `firstName`, `lastName`, `email`, `password`

```
POST /auth/register/user
```

On success → redirect to `/login`

---

### 2. `/register/hospital` — Hospital Registration

Two-section form:

**Hospital Info:** `name`, `description`

**Admin Account:** `firstName`, `lastName`, `email`, `password`

**Location:** `address`, `city`, `state`, `zipCode`, `country`

```
POST /auth/register/hospital
```

On success → redirect to `/login`

---

### 3. `/hospitals` — Hospital Listing Page

Search/filter hospitals. Supports query params:

```
GET /search/advanced/hospitals?q=&city=&state=&type=&minRating=&maxRating=&limit=20&offset=0
```

Institution types: `HOSPITAL`, `CLINIC`, `DIAGNOSTIC_CENTRE`, `NURSING_HOME`

Display each hospital card with: name, city/state, rating, institution type.

Each card links to `/hospitals/[id]`.

---

### 4. `/hospitals/[id]` — Hospital Detail Page

```
GET /hospitals/:id
GET /reviews/hospital/:id   ← returns { reviews, score }
GET /hospitals/:id/is-favourite   ← requires Bearer token
```

Display:
- Hospital name, description, location, phone, website, email, booking link
- Services offered (array of strings)
- Opening hours
- Overall rating + breakdown (cleanliness, staff behaviour, wait time)
- Gallery images
- List of approved reviews (with star ratings and text)
- Departments and accreditations

Actions (logged-in patients only):
- Add/remove favourite button → `POST/DELETE /hospitals/:id/favourite`
- Write a review → opens review form modal

**Review form fields** (all required, 1–5 stars each):
- `ratingOverall`, `ratingCleanliness`, `ratingStaffBehaviour`, `ratingWaitTime`
- `text` (optional written review)

```
POST /reviews
Body: { ratingOverall, ratingCleanliness, ratingStaffBehaviour, ratingWaitTime, text, hospitalId }
```

---

### 5. `/doctors` — Doctor Listing Page

```
GET /search/advanced/doctors?q=&specialization=&city=&minRating=&maxRating=&limit=20&offset=0
```

Display each doctor card with: name, specialization, consultation fee, rating.

Each card links to `/doctors/[id]`.

---

### 6. `/doctors/[id]` — Doctor Detail Page

```
GET /doctors/:id
GET /reviews/doctor/:id   ← returns { reviews, score }
```

Display:
- Name, specialization, bio, experience years
- Qualifications (array of strings)
- Consultation fee
- Profile photo
- Affiliated hospitals
- Approved reviews with rating breakdown

Actions (logged-in patients only):
- Write a review → same review form, but pass `doctorId` instead of `hospitalId`

---

### 7. `/dashboard` — Patient Dashboard

Requires login (`PATIENT` role).

Show:
- Welcome message with user's name
- Quick links to: Favourites, My Reviews, Search
- Recently viewed or trending hospitals (use `GET /search/trending`)

---

### 8. `/dashboard/favourites` — Saved Favourites

Requires login.

```
GET /hospitals/user/favourites
```

List of saved hospitals. Each has a remove button:

```
DELETE /hospitals/:hospitalId/favourite
```

---

### 9. `/dashboard/my-reviews` — Patient's Reviews

Requires login. Fetch reviews from the hospital/doctor detail endpoints filtered by the logged-in user, or display them from local state after submission.

Allow editing a review:
```
PUT /reviews/:id
Body: { ratingOverall?, ratingCleanliness?, ratingStaffBehaviour?, ratingWaitTime?, text? }
```

Allow deleting:
```
DELETE /reviews/:id
```

---

### 10. `/hospital-admin` — Hospital Admin Dashboard

Requires login (`HOSPITAL_ADMIN` role).

Show:
- Hospital profile summary
- Rating overview
- Recent reviews
- Quick actions: upload photo, manage images

Upload profile photo:
```
POST /hospitals/:hospitalId/upload-photo
Content-Type: multipart/form-data
Field name: "photo"
Allowed: JPEG, PNG, WebP
```

Upload multiple images:
```
POST /hospitals/:hospitalId/upload-images
Content-Type: multipart/form-data
Field name: "images" (up to 10 files)
```

Delete an image:
```
DELETE /hospitals/:hospitalId/images/:imageId
```

---

### 11. `/hospital-admin/reviews` — Manage Reviews

Requires `HOSPITAL_ADMIN` role.

Show all reviews for their hospital. Allow replying:

```
POST /reviews/:id/reply
Body: { replyText: "..." }
```

---

### 12. `/admin/reviews` — Platform Admin Moderation

Requires `PLATFORM_ADMIN` role.

```
GET /reviews/pending
```

For each pending review, show approve/reject buttons:

```
POST /reviews/:id/approve
POST /reviews/:id/reject
```

---

### 13. `/community` — Community Posts

Public feed of community posts.

```
GET /community
```

Logged-in users can create a post:

```
POST /community
Body: { title, content }
```

---

## Already Built Pages

| Page | Status |
|---|---|
| `/` — Home + Search | Done |
| `/login` | Done |
| `/register` — Role selection | Done |

---

## Shared API Helper (Recommended)

Create `apps/web/src/lib/api.ts` to centralise fetch calls:

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
```

---

## Auth Context (Recommended)

Create `apps/web/src/context/AuthContext.tsx` to store the logged-in user globally. On login, save `access_token`, `refresh_token`, and `user` object. Expose a `useAuth()` hook for role-based rendering.

---

## Design Notes

- Color palette: blue-600 primary, cyan-500 accent, slate-50 background — already established in existing pages
- Rounded corners: `rounded-2xl` / `rounded-3xl` for cards
- Shadows: `shadow-xl` for cards, `shadow-sm` for inputs
- Font: Inter (already set in `layout.tsx`)
- Use `react-hot-toast` for all success/error notifications
- Use `lucide-react` for all icons

---

## Running Locally

```bash
# From repo root
pnpm install

# Start the database
docker compose up postgres -d

# Run backend (from apps/api)
pnpm start:dev

# Run frontend (from apps/web)
pnpm dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:3001`.
