## The Authentication Flow (Security)

This diagram illustrates the process of Registration and Login 

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Next.js Signup Page
    participant Ctrl as AuthController
    participant Svc as AuthService
    participant DB as PostgreSQL (Prisma)

    User->>UI: Enters Email & Password
    UI->>Ctrl: POST /api/auth/register/patient
    Ctrl->>Svc: registerPatient(dto)
    Svc->>Svc: Hash password with bcrypt [cite: 84]
    Svc->>DB: Create User record [cite: 192]
    DB-->>Svc: User saved
    Svc-->>Ctrl: Return JWT Access + Refresh tokens [cite: 85, 87]
    Ctrl-->>UI: 201 Created [cite: 269]
    UI-->>User: Redirect to Dashboard
```



## The Search Flow (Performance)

This diagram illustrates the performance-critical path of the application. 

```mermaid
sequenceDiagram
    autonumber
    actor Guest
    participant UI as Next.js Frontend
    participant Svc as SearchService
    participant Cache as In-Memory Cache (Node Map) [cite: 251]
    participant DB as PostgreSQL (Prisma)

    Guest->>UI: Searches by City (e.g., "Noida") [cite: 111]
    UI->>Svc: GET /api/search?q=Noida [cite: 246]
    Svc->>Cache: Check for cached results [cite: 251]
    
    alt Cache Hit
        Cache-->>Svc: Return cached data (<20ms) [cite: 270]
    else Cache Miss
        Svc->>DB: Query institutions (Prisma skip/take) [cite: 254]
        DB-->>Svc: Results
        Svc->>Cache: Set cache (5-min TTL) [cite: 251]
    end
    
    Svc-->>UI: Return Search Results [cite: 270]
    UI-->>Guest: Display Hospital list
```



## The Review Submission Flow (Logic & SOLID)

This diagram, illustrates the Core Business Logic.

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant UI as Next.js Frontend
    participant Guard as JwtAuthGuard / RolesGuard [cite: 206]
    participant Ctrl as ReviewController
    participant Svc as ReviewService
    participant Strategy as RatingContext (Strategy Pattern) [cite: 166]
    participant DB as PostgreSQL (Prisma)

    Patient->>UI: Submits review form [cite: 260]
    UI->>Guard: POST /api/reviews (with JWT) [cite: 261]
    Note over Guard: Check PATIENT role [cite: 262]
    Guard->>Ctrl: Validated DTO
    Ctrl->>Svc: submitReview(userId, dto) [cite: 263]
    
    Svc->>DB: Check for duplicate review [cite: 188]
    Svc->>DB: Save new review record [cite: 192]
    
    Note over Svc, Strategy: Select Hospital vs Lab Strategy [cite: 167]
    Svc->>Strategy: calculate(reviews, type) [cite: 169]
    Strategy->>DB: Update Institution Avg Ratings [cite: 193]
    
    Svc-->>Ctrl: Success
    Ctrl-->>UI: 201 Created [cite: 268]
```
