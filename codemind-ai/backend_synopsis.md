# CodeMind AI — Clean Architecture Backend Synopsis
## Domain-Driven FastAPI Engine with Plugin Analyzers & Use Cases

The **CodeMind AI Backend** is a production-quality, clean-architecture Python ASGI engine built with **FastAPI**, **SQLAlchemy**, and **SQLite**. It enforces strict separation of concerns across **Domain**, **Application**, **Infrastructure**, and **API** layers.

---

## 1. System Folder Architecture

```
backend/
├── run.sh                   # Unified macOS developer launcher
├── codemind.db              # SQLite Local Database
└── app/
    ├── main.py              # Application entrypoint & auto-seeding
    │
    ├── core/                # Core Framework & Dependency Injection
    │   ├── settings.py      # BaseSettings environment manager
    │   ├── container.py     # Dependency Injection Container
    │   └── security.py      # Passlib bcrypt & JWT cryptography
    │
    ├── domain/              # Core Business Rules (Framework Agnostic)
    │   ├── models/          # SQLAlchemy Entities (User, Organization, Project, Finding, AuditLog)
    │   ├── policies/        # Authorization policies (Organization, Project, Review)
    │   ├── repositories/    # Data Persistence Interfaces (UserRepository, OrgRepository, ProjectRepository, ReviewRepository, AuditRepository)
    │   ├── analyzers/       # Plugin-Based Code Analyzers
    │   │   ├── base.py      # BaseAnalyzer abstract interface & FindingResult schema
    │   │   ├── registry.py  # Auto-discovery registry runner
    │   │   ├── ast/         # Python AST Static Linter (CWE-89, CWE-798, CWE-397)
    │   │   └── security/    # OWASP vulnerability scanner
    │   └── ai/              # AI Agents & Specialist Models
    │       ├── agents/      # BaseAgent, SecurityAgent, SupervisorAgent
    │       └── rag/         # Local TF-IDF semantic vector indexer
    │
    ├── application/         # Orchestration & Business Actions
    │   ├── use_cases/       # Single-responsibility business actions (CreateReview, ImportRepository)
    │   └── workflows/       # Multi-step pipeline execution (ReviewPipeline)
    │
    ├── infrastructure/      # External Frameworks & Systems
    │   ├── observability/   # Structured logging, metrics, tracing, health checks
    │   ├── database/        # SessionMaker & SQLite engine setup
    │   ├── workers/         # Background job runners (ReviewWorker)
    │   ├── reports/         # Compliance exporters (Markdown, HTML, JSON)
    │   └── notifications/   # In-app toast & delivery handlers
    │
    └── api/                 # API Presentation Layer
        ├── router.py        # Centralized APIRouter aggregator
        ├── deps.py          # Dependency injection helpers (get_container_dep, get_current_user)
        └── v1/
            ├── routes/      # Domain-specific endpoint routes (auth, organizations, projects, reviews, chat, audit-logs, health)
            └── controllers/ # Request controllers delegating to Use Cases
```

---

## 2. Layer Responsibilities

1. **Domain Layer (`app/domain/`)**: Holds pure entities (`Organization`, `AuditLog`, `Finding`), data persistence repositories (`user_repository.py`), policy checks, AI agents, and plugin analyzers. It operates independently of HTTP frameworks.
2. **Application Layer (`app/application/`)**: Houses single-action Use Cases (`CreateReview.py`) and multi-step pipeline workflows (`review_pipeline.py`).
3. **Infrastructure Layer (`app/infrastructure/`)**: Contains SQLite database connectors, structured observability (`logging.py`, `metrics.py`, `health.py`), and exporter formats.
4. **API Layer (`app/api/`)**: Thin FastAPI route controllers that validate request parameters, resolve container dependencies via `deps.get_container_dep`, and delegate business logic to Use Cases.

---

## 3. Registered Domain Routes

| Path | Method | Layer Delegate | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | `UserRepository` | Validates credentials and returns Bearer JWT |
| `/api/v1/organizations/` | `GET` | `OrganizationRepository` | Lists multi-tenant workspaces |
| `/api/v1/projects/` | `GET` | `ProjectRepository` | Lists workspace projects |
| `/api/v1/reviews/` | `POST` | `ReviewPipeline` | Runs AST, AI agents, and persists findings |
| `/api/v1/audit-logs/` | `GET` | `AuditRepository` | Retrieves immutable audit event trail |
| `/api/v1/health/health` | `GET` | `HealthCheck` | Runs system diagnostics |
