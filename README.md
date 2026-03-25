<div align="center">

# 🏥 AyuSangh

**Digital Healthcare Discovery & Institutional Rating Platform**

![Status](https://img.shields.io/badge/status-architecture%20finalization-blue?style=for-the-badge)
![Phase](https://img.shields.io/badge/phase-documentation%20%26%20design-green?style=for-the-badge)
![Year](https://img.shields.io/badge/year-2026-lightgrey?style=for-the-badge)

_Building transparent, trustworthy healthcare discovery for informed decision-making_

---

</div>

## 📋 Quick Navigation

| Section | Purpose |
|---------|---------|
| 🎯 **[Overview](#-overview)** | What is AyuSangh? |
| 🛠️ **[Tech Stack](#-technology-stack)** | Official technology choices |
| 🏗️ **[Architecture](#-architecture-summary)** | System design philosophy |
| 📚 **[Documentation](#-documentation-hub)** | All reference documents & diagrams |
| 📦 **[Project Structure](#-project-structure)** | Repository layout |
| ✅ **[Standards](#-engineering-standards)** | Development rules & best practices |

---

## 🎯 Overview

AyuSangh is a healthcare discovery and institutional rating platform designed to help patients make informed decisions about hospitals and doctors through transparent profile data, structured search, and trusted review workflows.

> This repository contains the **official project architecture and design documentation**, including technical stack standards, UML artifacts, and engineering guidelines for team consistency.

### Why AyuSangh?

- ✅ Transparent institutional data (accreditation, pricing, facilities)
- ✅ Trusted review system with verification
- ✅ Smart search and comparison tools
- ✅ Booking and provider workflow support
- ✅ Professional rating mechanisms


---

## 🛠️ Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | Node.js LTS | Non-blocking I/O for concurrent requests |
| **Language** | TypeScript | Strong typing & SOLID compliance |
| **Framework** | NestJS | Enforced architecture & DI containers |
| **Database** | PostgreSQL | ACID transactions & relational integrity |
| **ORM** | Prisma | Type-safe queries & migrations |
| **Package Manager** | **pnpm** | Fast, strict monorepo support |
| **Architecture** | Modular Monolith | Isolated domains, future microservices-ready |
| **Repository** | Monorepo | Code sharing across packages |

> 📌 **Official Reference:** [Documentation/Tech_stack.md](Documentation/Tech_stack.md) | [Full Tech Doc](https://docs.google.com/document/d/1-G22isMKkl9s3SFiftLLafNPJfjmmNOha60sfwO6ZQk/edit?usp=sharing)

---

## 🏗️ Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│  Architecture: Modular Monolith                      │
│  Repository: Monorepo                               │
│  Scalability Path: Microservices-ready              │
│  Security: JWT + Role-Based Access Control (RBAC)  │
│  Design Discipline: SOLID + Design Patterns         │
└─────────────────────────────────────────────────────┘
```

**Key Principles:**
- Repository Pattern (decoupled data access)
- Service Layer Pattern (business logic isolation)
- Strategy Pattern (interchangeable rating logic)
- Clean dependency injection & modular boundaries

---

## 📚 Documentation Hub

### 📖 Core Documents

| Document | Purpose |
|----------|---------|
| [Technical Stack](Documentation/Tech_stack.md) | Official tech decisions & standards |
| [Doc Index](Documentation/README.md) | Complete documentation guide |
| [Tech Doc (Google)](https://docs.google.com/document/d/1-G22isMKkl9s3SFiftLLafNPJfjmmNOha60sfwO6ZQk/edit?usp=sharing) | Full architecture & decisions |
| [Business Context](https://docs.google.com/document/d/1ZyYwcTCum-Fecm7d04Sa814q5Le95rPyNCcIVYWyaN0/edit?usp=sharing) | Market & feature details |

### 🎨 UML Diagrams

All diagrams are meticulously documented with tools and status. [**Full inventory here →**](Documentation/README.md#3-diagram-inventory-and-tool-used)

| Diagram Type | Tool | Status |
|--------------|------|--------|
| **Class Diagram** | D2 | 🕐 Pending |
| **ER Diagram** | dbdiagram.io | ✅ Complete |
| **Use Case Diagram** | External file | ✅ Complete |
| **Sequence: Admin Updates** | D2 | ✅ Complete |
| **Sequence: Search Institutions** | D2 | ✅ Complete |
| **Sequence: Submit Review** | D2 + SVG | ✅ Complete |

**Quick Access:**
- [Class Diagram](Documentation/UML_Diagrams/Class_Diagram)
- [ER Model](Documentation/UML_Diagrams/ER_Diagrams/ER.md)
- [Use Case](Documentation/UML_Diagrams/UseCase_Diagram/UseCase.md)
- [Sequence Diagrams](Documentation/UML_Diagrams/Sequence_Diagrams)


---

## 📦 Project Structure

```
AyuSangh/
├── 📄 README.md                          # This file
└── 📁 Documentation/
    ├── 📄 README.md                      # Doc index & diagram inventory
    ├── 📄 Tech_stack.md                  # Detailed tech standards
    └── 📁 UML_Diagrams/
        ├── 📁 Class_Diagram/             # Object-oriented architecture
        ├── 📁 ER_Diagrams/               # Database schema
        │   └── ER.md                     # Link to dbdiagram
        ├── 📁 Sequence_Diagrams/         # Flow diagrams (D2 format)
        │   ├── Admin_Updates_Institution_Profile/
        │   ├── Search_Institutions/
        │   └── Submit_Review/            # Includes .d2 & .svg
        └── 📁 UseCase_Diagram/           # Feature & actor mapping
            └── UseCase.md                # Link to shared diagram
```

---

## 🧩 Domain Modules (Planned Backend Boundaries)

```
┌─────────────────────────────────────────────────────┐
│              Featured Modules                        │
├─────────────────────────────────────────────────────┤
│  🔐 auth            🏥 hospital      👨‍⚕️ doctor      │
│  ⭐ review          💰 cost          🎖️ accreditation │
│  🔍 search          💬 community     📊 analytics    │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Engineering Standards

### ✔️ Must Do

- ✅ Use **pnpm** exclusively (not npm)
- ✅ Follow **module-based folder structure**
- ✅ Keep business logic in **services**, never controllers
- ✅ Use **DTOs** for all request/response handling
- ✅ Write **descriptive, conventional commits**
- ✅ Maintain **SOLID-compliant code**
- ✅ Use **explicit types** (no `any`)

### ❌ Must Not Do

- ❌ Use `npm` (violates workspace consistency)
- ❌ Place business logic in controllers
- ❌ Skip DTOs for request/response validation
- ❌ Create circular module dependencies
- ❌ Commit untested code to `main`
- ❌ Use TypeScript `any` type

> 📖 **Full Standards:** [Tech_stack.md § 9](Documentation/Tech_stack.md#9-development-standards)

---

## 📊 Current Status

| Phase | Status | Timeline |
|-------|--------|----------|
| Architecture & Design | 🟢 In Progress | Current |
| UML & Documentation | 🟢 In Progress | Current |
| Monorepo Bootstrap | 🟡 Planned | Next |
| API Implementation | ⚪ Pending | Post-Approval |

---

## 📞 Quick Links

- **Full Documentation:** [Documentation/README.md](Documentation/README.md)
- **Tech Stack Details:** [Documentation/Tech_stack.md](Documentation/Tech_stack.md)
- **Official Tech Doc:** https://docs.google.com/document/d/1-G22isMKkl9s3SFiftLLafNPJfjmmNOha60sfwO6ZQk/edit?usp=sharing

---

<div align="center">

**Internal Academic Project Documentation**  
Confidential - Internal Use Only · Version 1.0 · 2026

</div>