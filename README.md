# 🏥 AyuSangh - Digital Healthcare Discovery & Institutional Rating Platform

[![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-React-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Backend-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg)](https://www.prisma.io/)
[![pnpm](https://img.shields.io/badge/pnpm-Workspaces-orange.svg)](https://pnpm.io/)

---

## 📖 Project Overview
**AyuSangh** is a comprehensive, modern healthcare discovery platform built to bridge the gap between patients, healthcare providers, and institutions. It facilitates the search for hospitals and doctors, provides verified institutional ratings, offers transparent treatment cost estimations, and fosters a supportive community through discussion forums.

Engineered as a **Modular Monolith** within a **Monorepo** structure (managed by `pnpm` workspaces), AyuSangh handles complex healthcare data management while strictly adhering to industry-standard engineering practices and SOLID principles.

---

## ✨ Key Features
- **🔍 Advanced Healthcare Search**: Discover hospitals and doctors using sophisticated search algorithms and filters.
- **🏥 Hospital & 👨‍⚕️ Doctor Profiles**: Detailed profiles for institutions and medical professionals.
- **⭐ Institutional Ratings & Reviews**: Authentic user reviews to help patients make informed decisions.
- **💰 Treatment Cost Estimator**: Transparent cost estimations for various medical procedures.
- **💬 Community Forums**: Integrated community discussion boards for patient support and healthcare queries.
- **🔐 Secure Authentication**: JWT-based Authentication coupled with robust Role-Based Access Control (RBAC).

---

## 💻 Tech Stack

### Core Technologies
- **Runtime Environment**: Node.js (LTS)
- **Programming Language**: TypeScript (Strict typing enabled across the entire codebase)
- **Package Manager**: pnpm (Workspaces enabled for monorepo management)

### Frontend (Client)
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Features**: Server-Side Rendering (SSR), Static Site Generation (SSG), Responsive Design

### Backend (Server)
- **Framework**: NestJS
- **Architecture**: Controller-Service-Repository Pattern
- **Database**: PostgreSQL
- **ORM**: Prisma

### Infrastructure
- **Containerization**: Docker & Docker Compose (for local database spin-up)

---

## 📂 Project Structure

AyuSangh is organized as a monorepo containing multiple applications and shared packages:

```text
AyuSangh/
├── apps/
│   ├── api/                 # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/        # Authentication & RBAC
│   │   │   ├── community/   # Forums & Discussions
│   │   │   ├── cost/        # Treatment Cost Estimator
│   │   │   ├── doctor/      # Doctor Profiles
│   │   │   ├── hospital/    # Hospital Profiles
│   │   │   ├── review/      # Ratings & Reviews
│   │   │   ├── search/      # Search Service
│   │   │   └── users/       # User Management
│   └── web/                 # Next.js Frontend Client
│       └── src/app/         # Next.js App Router (auth, hospitals, search, etc.)
├── packages/
│   └── shared-types/        # Shared TS interfaces & enums between API and Web
├── docker-compose.yml       # Local PostgreSQL database setup
├── pnpm-workspace.yaml      # Monorepo workspace configuration
└── package.json             # Root dependencies and scripts
```

---

## 🛠️ Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) (v10+ required. Do **NOT** use `npm` or `yarn`)
- [Docker & Docker Compose](https://www.docker.com/) (Required for the database)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AyuSangh
   ```

2. **Install dependencies**
   > **⚠️ Important:** You must use `pnpm` to install dependencies across workspaces.
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   - Navigate to `apps/api` and `apps/web` respectively.
   - Duplicate the `.env.example` file and rename it to `.env` in both directories.
   - Fill in the required environment variables (e.g., database connection string, JWT secrets).

4. **Start the Database**
   Spin up the PostgreSQL instance using Docker:
   ```bash
   docker-compose up -d
   ```

5. **Database Migration & Seeding**
   Initialize your database schema and seed it with mock data:
   ```bash
   pnpm --filter api prisma:migrate
   pnpm seed
   ```

---

## 🚀 Running the Application

You can start the entire stack (both API and Web applications concurrently) from the root directory.

```bash
# Using the root package.json script
pnpm dev

# OR using the provided bash script directly
./dev.sh
```

**Access Points:**
- **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Backend (NestJS API)**: [http://localhost:3001](http://localhost:3001)

*To gracefully stop all processes, press `Ctrl+C` in your terminal.*

---

## 🏗️ Architecture & Design Principles

AyuSangh employs a **Modular Monolith** architecture. This approach provides the simplicity of a single deployable unit while maintaining strict boundaries between domains, making it highly microservices-ready for future scaling needs.

- **Strict Boundaries**: The `apps/api` enforces a solid Controller-Service-Repository pattern. Data access logic is strictly decoupled from business rules.
- **End-to-End Type Safety**: By leveraging `packages/shared-types`, any change in API response interfaces immediately flags type errors in the Web frontend, eliminating runtime surprises.
- **SOLID Principles**: The codebase strictly adheres to Object-Oriented paradigms, ensuring code is maintainable, testable, and extensible.

---

## 👥 Team Members & Contributions


| Name | Role | Core Contributions |
| :--- | :--- | :--- |
| **Antik Mondal** | Team Lead / Full Stack | Project architecture, Monorepo setup, Backend integration & System synchronization |
| **Ankita Thakur** | Backend Developer | REST API development, PostgreSQL schema design, Hospital & Doctor modules |
| **Anushka Tyagi** | Frontend Developer | Next.js UI development, Tailwind CSS styling, API consumption & Client state |
| **Anusha Prathapani** | Logic & Features | Rating & Review logic, Search optimization, Treatment cost estimator algorithms |
| **Farhana Pervin** | Testing & Documentation | Technical documentation, Manual/Unit testing, Bug tracking & QA reporting |


