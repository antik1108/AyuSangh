<div align="center">

# 🏥 AyuSangh - Healthcare Discovery Platform

**Digital Healthcare Discovery & Institutional Rating Platform**

![License](https://img.shields.io/badge/license-UNLICENSED-red?style=for-the-badge)
![Node](https://img.shields.io/badge/node-≥18-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-^5.9-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active%20development-brightgreen?style=for-the-badge)

**Making transparent healthcare data accessible to everyone**

[📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🏗️ Architecture](#-architecture-overview) • [👥 Contributing](#-contributing)

---

</div>

## 📋 Table of Contents

1. [🎯 Project Overview](#-project-overview)
2. [🛠️ Technology Stack](#-technology-stack)
3. [🚀 Quick Start](#-quick-start)
4. [📦 Project Structure](#-project-structure)
5. [🏗️ Architecture Overview](#-architecture-overview)
6. [💻 Development Workflow](#-development-workflow)
7. [🔧 For Frontend Developers](#-for-frontend-developers)
8. [🧪 Testing](#-testing)
9. [📖 Documentation](#-documentation)
10. [👥 Contributing](#-contributing)
11. [❓ Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

**AyuSangh** is a comprehensive healthcare discovery and institutional rating platform that empowers patients to make informed decisions about hospitals and doctors.

### 🎯 Core Features

- **🔍 Smart Search** - Find hospitals and doctors by specialty, location, ratings
- **⭐ Trusted Reviews** - Verified patient reviews with structured rating system
- **🏥 Institution Profiles** - Comprehensive hospital and doctor information
- **💰 Price Transparency** - Clear cost information for procedures
- **📊 Advanced Analytics** - Hospital performance metrics and statistics
- **🔐 Secure Access** - JWT-based authentication with role-based permissions

### 👥 User Roles

- **Patients** - Browse institutions, write reviews, save favorites
- **Hospital Admins** - Manage institution profiles, view analytics
- **Doctors** - Manage professional profiles
- **System Admins** - Platform management and moderation

---

## 🛠️ Technology Stack

### 📚 Backend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | ≥18 LTS | JavaScript runtime |
| **Language** | TypeScript | ^5.9 | Type-safe JavaScript |
| **Framework** | NestJS | ^11.0 | Server framework with DI |
| **Database** | PostgreSQL | 15 | Relational database |
| **ORM** | Prisma | ^6.6 | Type-safe database client |
| **Auth** | JWT + Passport | ^11.0 | Authentication & authorization |
| **Validation** | class-validator | ^0.15 | DTO validation |
| **Password** | bcrypt | ^6.0 | Secure password hashing |

### 🎨 Frontend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 16.2.1 | React framework |
| **React** | React | 19.2.4 | UI library |
| **Styling** | Tailwind CSS | ^4 | Utility-first CSS |
| **Icons** | Lucide React | ^1.7 | Icon library |
| **Notifications** | React Hot Toast | ^2.6 | Toast notifications |
| **Language** | TypeScript | ^5 | Type safety |

### 🔧 DevOps & Tools

| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager (strict monorepo) |
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest** | Unit testing |
| **Prisma Studio** | Database GUI |

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** ≥ 18 ([Download](https://nodejs.org/))
- **pnpm** ≥ 9 ([Install link](https://pnpm.io/installation))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Git**

### ✅ Verify Installation

```bash
# Check versions
node --version      # Should be v18+
pnpm --version      # Should be 9.0.0+
docker --version
docker-compose --version
```

### 🔧 Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/AyuSangh.git
cd AyuSangh
```

### 📦 Step 2: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

> ⚠️ **Important:** Always use `pnpm`, never `npm`. This project uses a strict monorepo setup.

### 🗄️ Step 3: Setup Environment Variables

Create `.env.local` in the project root:

```bash
# Database Configuration
DATABASE_URL="postgresql://ayusangh_admin:ayusangh_password@localhost:5432/ayusangh_db"

# JWT Configuration
JWT_SECRET="your-secret-jwt-key-change-in-production"
JWT_EXPIRATION="8h"

# Server Configuration
API_PORT=3000
WEB_PORT=3001

# Development
NODE_ENV="development"
```

### 🐳 Step 4: Start Database with Docker

```bash
# Start PostgreSQL in background
docker-compose up -d postgres

# Verify database is running
docker-compose ps
```

### 🔄 Step 5: Setup Database Schema

```bash
# Run Prisma migrations
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### 🚀 Step 6: Start Development Servers

**Option A: Run Everything Together**
```bash
docker-compose up --build
```

**Option B: Run Individually (Recommended for Development)**

```bash
# Terminal 1: Start Backend API
cd apps/api
pnpm dev

# Terminal 2: Start Frontend (new terminal)
cd apps/web
pnpm dev
```

### ✨ Verify Everything is Running

```bash
# Test Backend
curl http://localhost:3000/hospitals

# Open Frontend
open http://localhost:3001
```

You should see the AyuSangh homepage! 🎉

---

## 📦 Project Structure

```
AyuSangh/                                    # Root workspace
│
├── 📄 package.json                         # Workspace configuration
├── 📄 pnpm-workspace.yaml                  # pnpm monorepo config
├── 📄 docker-compose.yml                   # Docker services
├── 📄 tsconfig.base.json                   # Base TypeScript config
│
├── apps/                                   # Application packages
│   ├── api/                                # ✨ Backend API (NestJS)
│   │   ├── src/
│   │   │   ├── auth/                       # Authentication module
│   │   │   ├── hospital/                  # Hospital module
│   │   │   ├── doctor/                    # Doctor module
│   │   │   ├── review/                    # Review module
│   │   │   ├── search/                    # Search module
│   │   │   ├── common/                    # Shared services
│   │   │   ├── database/                  # Database service
│   │   │   └── main.ts                    # Entry point
│   │   ├── Dockerfile                      # API container config
│   │   └── package.json                    # API dependencies
│   │
│   └── web/                                # ✨ Frontend App (Next.js)
│       ├── src/
│       │   ├── app/                        # Next.js app directory
│       │   ├── components/                 # React components
│       │   ├── pages/                      # Next.js pages
│       │   └── styles/                     # Global styles
│       ├── Dockerfile                      # Web container config
│       └── package.json                    # Web dependencies
│
├── packages/                               # Shared packages
│   ├── shared-types/                       # Shared TypeScript types
│   ├── config/                             # Configuration utilities
│   └── utils/                              # Utility functions
│
├── prisma/                                 # Database schema
│   ├── schema.prisma                       # Prisma schema
│   └── migrations/                         # Database migrations
│
├── Documentation/                          # Project documentation
│   ├── README.md                           # Documentation index
│   ├── Tech_stack.md                       # Tech decisions
│   └── UML_Diagrams/                       # Architecture diagrams
│
└── 📁 .github/                             # GitHub workflows
    └── workflows/                          # CI/CD pipelines
```

---

## 🏗️ Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Clients & Browsers                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │    Next.js Frontend (3001)   │
        │  • Components & Pages        │
        │  • API Client Integration    │
        └──────────────┬───────────────┘
                       │ HTTPS
                       ↓
        ┌──────────────────────────────┐
        │   NestJS Backend API (3000)  │
        │  • Controllers               │
        │  • Services & Business Logic │
        │  • Route Handlers            │
        ├──────────────────────────────┤
        │    Authentication Layer      │
        │  • JWT Tokens               │
        │  • Passport Strategies      │
        │  • Role-Based Guards        │
        └──────────────┬───────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │   PostgreSQL Database        │
        │  • Data Persistence         │
        │  • ACID Transactions        │
        │  • Relationships            │
        └──────────────────────────────┘
```

### Application Layers

**1. Controller Layer** (HTTP Entry Point)
```
web → NestJS Controller → Validates Request → Routes to Service
```

**2. Service Layer** (Business Logic)
```
Service → Applies Rules → Calls Repository → Returns Data
```

**3. Repository Layer** (Data Access)
```
Repository → Prisma ORM → SQL Queries → Database
```

### Key Design Patterns

| Pattern | Purpose | Usage |
|---------|---------|-------|
| **Repository** | Abstract data access | Decoupled database operations |
| **Service** | Business logic isolation | Complex domain operations |
| **Strategy** | Interchangeable algorithms | Rating calculations |
| **Dependency Injection** | Loose coupling | Module dependencies |
| **DTO** | Data contracts | Request/Response validation |
| **Guard** | Authorization checks | JWT + Role validation |

---

## 💻 Development Workflow

### 🌿 Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/hospital-profile

# 2. Make changes
# ... edit files ...

# 3. Commit with conventional messages
git add .
git commit -m "feat(hospital): add profile photo upload"
git push origin feature/hospital-profile

# 4. Create Pull Request on GitHub
# - Request review from team leads
# - Wait for CI/CD to pass
# - Get approval
# - Merge to main
```

### 📝 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(module): add new feature
fix(module): fix bug
docs: update documentation
style: format code
refactor: improve code structure
test: add unit tests
chore: update dependencies
```

**Examples:**
```bash
git commit -m "feat(auth): implement JWT refresh token flow"
git commit -m "fix(hospital): resolve null dereference in search"
git commit -m "docs(api): add OpenAPI documentation"
```

### 🔨 Common Development Commands

```bash
# Start development servers
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
pnpm test:watch

# Run linter
pnpm lint

# Format code
pnpm format

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio

# View database schema
npx prisma db pull
```

---

## 🔐 For Frontend Developers

### Frontend Quick Start

```bash
# Navigate to frontend app
cd apps/web

# Install dependencies (already done via pnpm install)
pnpm install

# Start development server
pnpm dev

# Open in browser
open http://localhost:3001
```

### 📂 Frontend Project Structure

```
apps/web/src/
├── app/                 # Next.js app router
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   └── [routes]/       # Dynamic pages
├── components/         # Reusable React components
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   └── HospitalCard.tsx
├── styles/            # Global & component styles
│   └── globals.css    # Tailwind imports
└── hooks/             # Custom React hooks
```

### 🔌 Connecting to Backend API

```typescript
// Example: Fetch hospitals from API
const response = await fetch("http://localhost:3000/hospitals");
const hospitals = await response.json();
```

### 🎨 Tailwind CSS

The project uses Tailwind CSS v4. For styling:

```tsx
// Use utility classes
<div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100">
    Click me
  </button>
</div>
```

### 📝 Component Guidelines

- ✅ Use functional components with hooks
- ✅ Keep components small and focused
- ✅ Use TypeScript for type safety
- ✅ Write JSDoc comments for complex logic
- ❌ Avoid prop drilling - use context when needed
- ❌ Don't fetch data inside child components

---

## 🧪 Testing

### Backend Testing

```bash
# Run unit tests
cd apps/api
pnpm test

# Run with coverage
pnpm test:cov

# Watch mode (re-run on changes)
pnpm test:watch

# E2E tests
pnpm test:e2e
```

### Test File Structure

```
src/
├── hospital/
│   ├── hospital.service.ts
│   ├── hospital.service.spec.ts    # Unit tests
│   └── hospital.controller.ts
```

### Example Unit Test

```typescript
// hospital.service.spec.ts
describe('HospitalService', () => {
  let service: HospitalService;
  let database: DatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HospitalService,
        { provide: DatabaseService, useValue: mockDatabase },
      ],
    }).compile();

    service = module.get<HospitalService>(HospitalService);
  });

  it('should fetch hospital by ID', async () => {
    const result = await service.getHospitalById('123');
    expect(result).toBeDefined();
    expect(result.id).toBe('123');
  });
});
```

---

## 📖 Documentation

### 📚 Documentation Files

| Document | For | Contents |
|----------|-----|----------|
| [ARCHITECTURE.md](apps/api/ARCHITECTURE.md) | Backend developers | API architecture & patterns |
| [Documentation/Tech_stack.md](Documentation/Tech_stack.md) | All developers | Technology decisions |
| [Documentation/README.md](Documentation/README.md) | All | Complete doc index |
| [UML Diagrams](Documentation/UML_Diagrams/) | Architects | System design visuals |

### 🔗 API Documentation

Once the API is running, access:

```
Interactive API Docs: http://localhost:3000/api
Database GUI:        http://localhost:5050 (pgAdmin)
```

### 📝 Updating Documentation

When you add a new feature:

1. Update relevant docs
2. Add code examples
3. Update API endpoints list
4. Add architecture diagram if needed

---

## 👥 Contributing

### 🎯 Contribution Guidelines

We welcome contributions from all team members! Please follow these guidelines:

### Step 1: Take an Issue

1. Check the [Issues](https://github.com/yourusername/AyuSangh/issues) tab
2. Assign yourself to an unassigned issue
3. Create a branch for your work

### Step 2: Code Quality Standards

**Backend (NestJS/TypeScript):**
- ✅ Follow [apps/api/ARCHITECTURE.md](apps/api/ARCHITECTURE.md)
- ✅ No `any` types - use explicit types
- ✅ Use dependency injection
- ✅ Keep business logic in services
- ✅ Add JSDoc comments
- ✅ Write unit tests

**Frontend (React/Next.js):**
- ✅ Functional components with hooks
- ✅ Server components where appropriate
- ✅ Responsive design with Tailwind
- ✅ TypeScript strict mode
- ✅ Meaningful component names

### Step 3: Testing

```bash
# For backend changes
pnpm --filter api test
pnpm --filter api lint

# For frontend changes
pnpm --filter web build

# Full test suite
pnpm test
```

### Step 4: Create Pull Request

1. Push your branch to GitHub
2. Create a PR with a clear description
3. Link related issues
4. Request review from maintainers
5. Address feedback

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Changes
- Change 1
- Change 2

## Testing
- [ ] Unit tests added
- [ ] Manual testing done
- [ ] No regressions

## Screenshots (if UI change)
<!-- Add screenshots here -->
```

---

## ❓ Troubleshooting

### Common Issues & Solutions

#### ❌ "pnpm: command not found"

```bash
# Install pnpm globally
npm install -g pnpm@9

# Verify installation
pnpm --version
```

#### ❌ Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps

# Start PostgreSQL if not running
docker-compose up -d postgres

# Verify connection
psql postgresql://ayusangh_admin:ayusangh_password@localhost:5432/ayusangh_db
```

#### ❌ Port Already in Use (3000 or 3001)

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env.local
```

#### ❌ Prisma Client Generation Error

```bash
# Regenerate Prisma client
npx prisma generate

# Or reset and migrate
npx prisma migrate reset --force
```

#### ❌ Dependency Issues after Pull

```bash
# Clean install
pnpm install

# Clear cache and reinstall
pnpm store prune
pnpm install
```

### 🐛 Debug Mode

```bash
# Backend with debugger
npm --filter api run start:debug

# VSCode: Set breakpoint and attach debugger
```

### 📱 Browser DevTools

```bash
# Frontend - Open DevTools
F12 or Cmd+Option+I

# Check Network tab for API calls
# Check Console for errors
```

---

## 🔗 Useful Links

### 🛠️ Development Tools
- [VS Code Extensions](docs/vscode-extensions.md)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 📚 Learning Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Database Design Patterns](https://www.patterns.dev/)

### 👥 Team & Support
- Slack: #ayusangh-dev
- Email: dev-team@ayusangh.example
- Issues: [GitHub Issues](https://github.com/yourusername/AyuSangh/issues)

---

## 📋 Checklist for New Team Members

Getting started? Use this checklist:

- [ ] Read this README completely
- [ ] Fork and clone the repository
- [ ] Install Node.js 18+ and pnpm 9+
- [ ] Run `pnpm install`
- [ ] Set up `.env.local`
- [ ] Start PostgreSQL with Docker
- [ ] Run database migrations
- [ ] Start `pnpm dev`
- [ ] Verify both servers running
- [ ] Read [ARCHITECTURE.md](apps/api/ARCHITECTURE.md)
- [ ] Read [Tech_stack.md](Documentation/Tech_stack.md)
- [ ] Ask questions in Slack

---

<div align="center">

## 💪 Ready to Contribute?

[📖 Read the Contributing Guide](#-contributing)  |  [🐛 Report a Bug](https://github.com/yourusername/AyuSangh/issues)  |  [✨ Request a Feature](https://github.com/yourusername/AyuSangh/discussions)

**Questions?** Reach out to the team on Slack or create an issue!

---

**Version:** 1.0.0  
**Last Updated:** March 2026  
**License:** UNLICENSED (Internal Use Only)

</div>

</div>