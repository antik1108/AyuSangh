# Digital Healthcare Discovery & Institutional Rating Platform

Technical Stack & Architecture Documentation  
System Design Group Project · 2026  
Version 1.0 · Confidential - Internal Use Only

## Official Document Link

- Google Docs Reference: https://docs.google.com/document/d/1-G22isMKkl9s3SFiftLLafNPJfjmmNOha60sfwO6ZQk/edit?usp=sharing

## Technology at a Glance

| Layer / Category | Technology / Decision |
|---|---|
| Runtime | Node.js LTS |
| Language | TypeScript |
| Framework | NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| Package Manager | pnpm (strict - no npm) |
| Architecture | Modular Monolith |
| Repository Style | Monorepo |

## 1. Purpose of This Document

This document defines the official technical stack, architecture standards, and development tooling for the Healthcare Discovery Platform. It serves as the single source of truth for all technical decisions made by the team.

### Why this document matters

All team members are required to follow these standards to ensure architectural consistency, a clean system design, a scalable codebase, industry-level engineering practices, and smooth collaboration throughout the project lifecycle.

## 2. Project Type & Architecture

| Category | Decision |
|---|---|
| Architecture Style | Modular Monolith |
| Repository Type | Monorepo |
| Scalability Path | Microservices-ready |

The system is backend-centric, designed for structured scalability. While the initial release targets a monolithic deployment, the modular architecture facilitates a future transition to microservices if operational demands require it.

## 3. Core Technology Stack

### 3.1 Runtime Environment - Node.js

Node.js (LTS) provides the server-side JavaScript runtime. Its event-driven, non-blocking I/O model makes it highly suitable for handling concurrent API requests common in healthcare discovery platforms.

### 3.2 Programming Language - TypeScript

TypeScript is the sole programming language used across the entire codebase. It provides strong static typing, improved maintainability, and interface-based architecture, all of which are essential for enterprise-grade healthcare systems.

#### Key benefits

- Strong compile-time type checking
- Interface-based module contracts
- Better IDE autocompletion and refactoring
- Improved SOLID principle adherence
- Significantly reduced runtime errors

#### Team standards

- No use of `any` type (use explicit types)
- DTOs must be fully typed
- Shared types live in `packages/shared-types`
- Prisma schema generates types automatically

### 3.3 Backend Framework - NestJS

NestJS is selected as the primary backend framework. It enforces a Controller-Service-Module structure that directly aligns with the Single Responsibility Principle and supports built-in Dependency Injection for clean, testable code.

#### Why NestJS over Express?

NestJS imposes architectural discipline by design. It enforces module separation, DI containers, guards, interceptors, and decorators out of the box. This helps prevent architectural drift in team-based development and aligns naturally with academic SOLID requirements.

### 3.4 Database - PostgreSQL

PostgreSQL is the primary relational database. Its support for foreign key enforcement, complex joins, ACID transactions, and index optimization makes it the appropriate choice for healthcare data where integrity is non-negotiable.

### 3.5 ORM - Prisma

Prisma is used for all database interactions. It provides type-safe query generation, declarative schema modeling, and automated migration management, integrating cleanly with both NestJS and TypeScript.

### 3.6 Package Manager - pnpm

pnpm is the mandatory package manager for this project. It provides faster installations, strict dependency isolation, and first-class monorepo workspace support.

#### Critical rule

`npm` must not be used anywhere in this project. All dependency management must use `pnpm` exclusively. Commits containing `package-lock.json` will be rejected.

Common pnpm commands used in this project:

```bash
pnpm install               # Install all workspace dependencies
pnpm add <package>         # Add a runtime dependency
pnpm add -D <package>      # Add a dev dependency
pnpm run dev               # Start the development server
pnpm -F api run build      # Build a specific workspace package
```

## 4. Repository Structure - Monorepo

The project follows a monorepo architecture to enable code sharing across future packages, maintain clean separation between applications, and support professional scalability.

### Root directory layout

```text
health-platform/
├── apps/
│   ├── api/                   -> NestJS Backend Application
│   └── web/                   -> Frontend Application (future phase)
│
├── packages/
│   ├── shared-types/          -> Shared TypeScript interfaces and enums
│   ├── config/                -> Shared configuration modules
│   └── utils/                 -> Shared utility functions
│
├── prisma/
│   └── schema.prisma          -> Master database schema definition
│
├── pnpm-workspace.yaml        -> Workspace configuration
├── package.json               -> Root package manifest
└── README.md
```

## 5. Backend Internal Structure (NestJS)

### Application modules

All business domains are encapsulated in individual feature modules located under `src/modules/`:

- auth
- hospital
- doctor
- review
- cost
- accreditation
- search
- community
- analytics

### Module file structure standard

Every module must follow the same internal file layout to ensure consistency and predictability:

```text
hospital/
	├── hospital.controller.ts      -> HTTP layer only (routing, req/res)
	├── hospital.service.ts         -> Business logic
	├── hospital.repository.ts      -> Database interaction (Prisma calls)
	├── hospital.module.ts          -> Dependency wiring and exports
	└── dto/
				├── create-hospital.dto.ts
				└── update-hospital.dto.ts
```

### Layer separation rules

- Controller: Handles HTTP layer only. No business logic. Maps requests to service calls.
- Service: Contains all business logic, rules, and orchestration. Calls repositories.
- Repository: Manages all database interactions via Prisma. No business logic.
- DTO: Defines data shape for request validation and transfer between layers.
- Module: Registers providers, controllers, and manages dependency injection.

## 6. Authentication & Security

### Authentication

- JWT-based stateless authentication
- bcrypt password hashing
- Secure token expiry and refresh strategy
- Environment variable credential protection

### Role-Based Access Control

- Patient: Read-only public data, post reviews
- Doctor: Manage own profile and patients
- Hospital Admin: Manage institution data
- Platform Admin: Full system access

## 7. Database Design

The database follows a strongly relational model with proper foreign key constraints, normalized structure, and indexed search columns to support the complex relationships inherent in healthcare data.

### Primary entities

- User: Core identity and auth
- Hospital: Institution data and ratings
- Doctor: Physician profiles and specialties
- Review: Patient-submitted ratings
- Cost: Treatment cost estimates
- Accreditation: Institutional certifications
- Department: Hospital departments
- Location: Geographic and address data
- CommunityPost: Forum and discussion posts

## 8. Design & Engineering Principles

### 8.1 Object-Oriented principles

- Encapsulation: Module internals are hidden behind clean service interfaces.
- Abstraction: Repository pattern abstracts database implementation details from services.
- Inheritance: Base guards, filters, and interceptors shared via class extension.
- Polymorphism: Rating strategies implement common interfaces for interchangeable behavior.

### 8.2 SOLID principles

- S - Single Responsibility: Each class (controller, service, repository) has exactly one reason to change.
- O - Open / Closed: Modules are open for extension (new strategies) and closed for modification.
- L - Liskov Substitution: Subtypes must be substitutable for their base types without breaking behavior.
- I - Interface Segregation: Clients depend only on the interfaces they actually use, with no fat interfaces.
- D - Dependency Inversion: High-level modules depend on abstractions, not concrete implementations.

### 8.3 Design patterns

- Repository Pattern: Decouples data access from business logic. Every module has a dedicated repository.
- Service Layer Pattern: All business rules live in services, keeping controllers thin and testable.
- Strategy Pattern: Used in rating calculation to allow interchangeable scoring algorithms.
- Factory Pattern (optional): Supports expansion of entity creation with complex construction logic.

## 9. Development Standards

All contributors must adhere to the following development standards. These are non-negotiable for maintaining code quality, consistency, and architectural integrity.

### Must do

- Use `pnpm` exclusively for all dependency management
- Follow module-based folder structure at all times
- Keep all business logic strictly inside services
- Use DTOs for all input validation and data transfer
- Write descriptive, conventional commit messages
- Maintain SOLID-compliant code structure

### Must not do

- Use `npm` (violates workspace consistency)
- Place business logic inside controllers
- Skip DTOs for request/response handling
- Create circular module dependencies
- Commit untested or broken code to `main`
- Use `any` type in TypeScript

## 10. Future Scalability Considerations

The following technologies are not part of the MVP, but the architecture has been designed to accommodate them without major refactoring. These are planned expansion capabilities for post-launch phases.

| Technology | Primary Use Case | Integration Path |
|---|---|---|
| Redis | Response caching and session management | NestJS CacheModule integration |
| Elasticsearch | Full-text search for hospitals and doctors | Replace basic DB search queries |
| Docker | Containerized deployment and dev parity | Dockerfile per app + compose |
| CI/CD Pipeline | Automated testing and deployment | GitHub Actions + staging environment |
| AWS / GCP | Cloud hosting and managed database | ECS / Cloud Run + RDS |

## 11. Summary

This project uses a modern, production-aligned technical stack designed to support complex healthcare data management, enforce structured architecture across a distributed team, and meet both academic system design requirements and real-world engineering standards.

### Design goal

Every architectural decision documented here was made to balance developer productivity, system scalability, code maintainability, and alignment with industry-standard software engineering practices.

## Complete Technology Reference

| Layer / Category | Technology / Decision |
|---|---|
| Runtime | Node.js LTS |
| Language | TypeScript |
| Framework | NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| Package Manager | pnpm (strict - npm prohibited) |
| Architecture Style | Modular Monolith |
| Repository Type | Monorepo |
| Auth Strategy | JWT + RBAC |
| OOP Paradigm | Encapsulation, Abstraction, Inheritance, Polymorphism |
| Design Principles | SOLID (all five principles enforced) |
| Design Patterns | Repository, Service Layer, Strategy, Factory (optional) |

End of Technical Stack Documentation · Version 1.0  
Digital Healthcare Discovery & Institutional Rating Platform · System Design Group Project 2026
