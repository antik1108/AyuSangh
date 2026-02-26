<hr />

<div align="center">

# AyuSangh

[![Category](https://img.shields.io/badge/category-digital%20healthcare-0f172a?style=flat-square)](#project-overview)
[![Architecture](https://img.shields.io/badge/architecture-modular%20monolith-2563eb?style=flat-square)](#architecture-philosophy)
[![Backend](https://img.shields.io/badge/backend-nestjs-16a34a?style=flat-square)](#tech-stack-planned)
[![Frontend](https://img.shields.io/badge/frontend-nextjs%2014-1d4ed8?style=flat-square)](#tech-stack-planned)

AyuSangh is a **Digital Healthcare Discovery & Institutional Rating Platform** — a trust layer that helps patients discover, compare, and choose hospitals/labs using transparent data.

Think: **Shiksha.com + trusted reviews + transparent pricing for healthcare institutions**.

[Project Overview](#project-overview) •
[Core Features](#core-feature-ecosystem) •
[Tech Stack](#tech-stack-planned) •
[Architecture](#architecture-philosophy) •
[Roadmap](#implementation-roadmap)

</div>

## Project Overview

In India, people can find hospitals quickly, but struggle to choose the **right** one with confidence.

AyuSangh solves this by combining:

- Data-driven discovery
- Verified and trust-scored reviews
- Institutional transparency (accreditation, pricing, facilities)
- Booking + provider workflow support

The goal is to help a patient find and book a suitable provider in under a minute, based on affordability, quality, and trust signals.

## Project Vision

Build the **Trust Infrastructure for Indian Healthcare** where:

- Patients make informed decisions with transparent, comparable data.
- Hospitals/labs get a professional digital storefront.
- The platform enforces quality through verification and moderation.

## Core Feature Ecosystem

### 1) Patient / User App (Discovery Experience)

- Smart search by specialty, procedure, or institution name
- Filter by location, price range, accreditation, and user ratings
- Institution fact sheets (beds, ICU, equipment, OPD timings, doctor roster)
- Price transparency tab for estimated procedure/test cost ranges
- Verified review system (text, stars, photos, trust badges)
- Real-time booking for OPD/lab slots + quote requests for major procedures
- Personal dashboard for appointments and medical document vault

### 2) Provider App (Hospitals / Clinics / Labs)

- Digital storefront management (photos, about, mission, facilities)
- Service and fee catalog (tests, surgeries, starting prices)
- Doctor directory and availability management
- Review response and abuse-report workflow
- Lead/booking analytics and conversion visibility

### 3) Honest Review & Trust Logic

- Evidence-based reviews (bill/prescription upload for trust amplification)
- Verified-patient tagging from confirmed platform bookings
- Institutional Rating Score (IRS) driven by:
  - User rating average
  - Accreditation quality (e.g., NABH/NABL/ISO)
  - Responsiveness to complaints and reviews

### 4) Admin / Moderator Panel

- Provider verification before public listing
- Content moderation for spam/abuse/fake reviews
- Platform-wide analytics (users, institutions, bookings)

## User Journey (How It Works)

1. User searches: “Best MRI lab in Jalpaiguri”
2. Platform shows comparable labs with price and trust signals
3. User validates profile data, reviews, accreditation
4. User books a time slot
5. Provider confirms booking
6. User receives notification and later submits review

## Tech Stack (Planned)

| Layer | Technology | Why |
|---|---|---|
| Monorepo Workspace | `pnpm workspaces` | Multi-app management with consistent dependencies |
| Backend | `NestJS` + `TypeScript` | Modular, scalable architecture aligned with SOLID |
| Database | `PostgreSQL` + `Prisma` | ACID reliability + type-safe DB access |
| Frontend | `Next.js 14` (App Router) | SSR, SEO, and performance for discovery pages |
| UI | `Tailwind CSS` + `shadcn/ui` | Fast, clean, accessible enterprise-style UI |
| Notifications (planned) | SMS/WhatsApp integration | Booking and status alerts |

## Architecture Philosophy

We are implementing a **Modular Monolith** where each domain is isolated but lives in one deployable system during early scale.

Planned modules:

- `Auth`
- `Institution`
- `Doctor`
- `ServiceCatalog`
- `Search`
- `Review`
- `Booking`
- `AdminModeration`
- `Analytics`

Benefits:

- Strong encapsulation and clear domain boundaries
- Easier testing and maintainability
- Future microservice extraction possible for high-traffic modules (e.g., booking/search)

## Proposed Repository Structure

```text
.
├─ apps/
│  ├─ web/            # Next.js frontend
│  └─ api/            # NestJS backend
├─ packages/
│  ├─ ui/             # shared UI components
│  ├─ config/         # shared lint/ts configs
│  └─ types/          # shared contracts/types
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ docs/
│  ├─ uml/
│  ├─ report/
│  └─ assets/
├─ tests/
├─ DOCS.md
└─ README.md
```

## Setup (Phase 1 - Documentation)

Current phase is architecture and documentation finalization.

```bash
git clone <your-repo-url>
cd AyuSangh
```

Use [DOCS.md](DOCS.md) for all source links and reference artifacts.

## Setup & Run (Phase 2 - After Codebase Bootstrap)

> These commands are planned and will be finalized once scaffolding starts.

```bash
pnpm install
pnpm dev
```

Possible app entry points:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## Mandatory Deliverables Coverage

This repository is being prepared to include:

- Complete, production-style codebase
- Report-ready architecture and engineering documentation
- UML artifacts and design rationale
- Test scenarios and results

## Team Members & Contributions

> Update this table with actual names and responsibilities.

| Team Member | Role | Primary Contribution | Status |
|---|---|---|---|
| Member 1 | TBD | TBD | Active |
| Member 2 | TBD | TBD | Active |
| Member 3 | TBD | TBD | Active |
| Member 4 | TBD | TBD | Active |

## Implementation Roadmap

- Finalize UML set (Class, Use Case, Sequence, ER)
- Lock system design and module boundaries
- Initialize monorepo with Next.js + NestJS + Prisma
- Implement core flows: discovery → profile → booking → review
- Add moderation and trust-scoring logic
- Validate with test cases and demo run

## Important Dates

- Group formation: **20-02-2026**
- Proposal submission: **25-02-2026**

---

Building a transparent, trustworthy, and data-driven healthcare discovery platform for real-world decision-making.