# AyuSangh

Digital Healthcare Discovery & Institutional Rating Platform  
System Design Group Project · 2026

## Overview

AyuSangh is a healthcare discovery and institutional rating platform focused on helping users compare hospitals and doctors through transparent profile data, structured search, and trusted review workflows.

This repository currently contains the official project architecture and design documentation, including technical stack standards and UML artifacts.

## Technology Stack (Official)

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

Primary reference: [Documentation/Tech_stack.md](Documentation/Tech_stack.md)

Official docs source link:  
https://docs.google.com/document/d/1-G22isMKkl9s3SFiftLLafNPJfjmmNOha60sfwO6ZQk/edit?usp=sharing

## Architecture Summary

- Architecture style: Modular Monolith
- Repository strategy: Monorepo
- Scalability path: Microservices-ready
- Security baseline: JWT + RBAC
- Design discipline: OOP + SOLID + Repository/Service/Strategy patterns

## Project Documentation Index

### Core documentation

- Document links index: [Documentation/README.md](Documentation/README.md)
- Technical stack and standards: [Documentation/Tech_stack.md](Documentation/Tech_stack.md)

### UML diagrams

- Class Diagram directory: [Documentation/UML_Diagrams/Class_Diagram](Documentation/UML_Diagrams/Class_Diagram)
- ER Diagram reference: [Documentation/UML_Diagrams/ER_Diagrams/ER.md](Documentation/UML_Diagrams/ER_Diagrams/ER.md)
- Use Case Diagram reference: [Documentation/UML_Diagrams/UseCase_Diagram/UseCase.md](Documentation/UML_Diagrams/UseCase_Diagram/UseCase.md)
- Sequence Diagram - Admin Updates Institution Profile: [Documentation/UML_Diagrams/Sequence_Diagrams/Admin_Updates_Institution_Profile/Admin_Updates_Institution_Profile.d2](Documentation/UML_Diagrams/Sequence_Diagrams/Admin_Updates_Institution_Profile/Admin_Updates_Institution_Profile.d2)
- Sequence Diagram - Search Institutions: [Documentation/UML_Diagrams/Sequence_Diagrams/Search_Institutions/Search_Institutions.d2](Documentation/UML_Diagrams/Sequence_Diagrams/Search_Institutions/Search_Institutions.d2)
- Sequence Diagram - Submit Review (source): [Documentation/UML_Diagrams/Sequence_Diagrams/Submit_Review/Submit_Review.d2](Documentation/UML_Diagrams/Sequence_Diagrams/Submit_Review/Submit_Review.d2)
- Sequence Diagram - Submit Review (rendered): [Documentation/UML_Diagrams/Sequence_Diagrams/Submit_Review/Submit_Review.svg](Documentation/UML_Diagrams/Sequence_Diagrams/Submit_Review/Submit_Review.svg)


## Domain Modules (Planned Backend Boundaries)

- auth
- hospital
- doctor
- review
- cost
- accreditation
- search
- community
- analytics

## Engineering Standards

- Use pnpm only for package management.
- Do not use npm in this project.
- Keep business logic in services, not controllers.
- Use DTOs for typed request/response boundaries.
- Avoid `any` in TypeScript.
- Follow SOLID and clean module boundaries.

## Current Repository Structure

```text
AyuSangh/
├── README.md
└── Documentation/
    ├── README.md
    ├── Tech_stack.md
    └── UML_Diagrams/
        ├── Class_Diagram/
        ├── ER_Diagrams/
        │   └── ER.md
        ├── Sequence_Diagrams/
        │   ├── Admin_Updates_Institution_Profile/
        │   │   └── Admin_Updates_Institution_Profile.d2
        │   ├── Search_Institutions/
        │   │   └── Search_Institutions.d2
        │   └── Submit_Review/
        │       ├── Submit_Review.d2
        │       └── Submit_Review.svg
        └── UseCase_Diagram/
            └── UseCase.md
```

## Status

Current phase: Architecture and documentation finalization.

Next phase: Monorepo bootstrap and implementation of API modules based on approved architecture.

## License

Internal academic project documentation. Confidential - Internal Use Only.