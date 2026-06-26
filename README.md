# 🧠 CodeMind AI — Enterprise-Grade Multi-Agent Code Auditor

[![Python Version](https://img.shields.io/badge/python-3.12-blue.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI Framework](https://img.shields.io/badge/fastapi-0.110.0-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Monaco Editor](https://img.shields.io/badge/monaco--editor-0.39.0-orange.svg?logo=visual-studio-code&logoColor=white)](https://github.com/microsoft/monaco-editor)
[![Tailwind CSS v3](https://img.shields.io/badge/tailwind-v3-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CodeMind AI is an enterprise-grade AI-powered code review and vulnerability scanning platform. It combines local AST static analyzers with a parallel multi-agent LLM pipeline and Retrieval-Augmented Generation (RAG) to inspect codebases for security risks, performance bottlenecks, logical bugs, and cognitive complexity.

Designed with a premium, luxury-tech dark-red interface (`#0A0A0A` base background, `#FF0000` accents), it features interactive side-by-side Monaco code diffs, automated inline patch application, and semantic repository-wide chat.

---

## 🚀 Key Pillars

1. **Static Analysis & AST Parsing**: Runs syntax parsing and abstract syntax tree audits to catch raw SQL injection concatenations, sensitive credentials leakages, and bare exception passes before LLM orchestration.
2. **Retrieval-Augmented Generation (RAG)**: Indexes files locally using a TF-IDF vector database. Fetches relevant security frameworks (OWASP Top 10) and coding styles (PEP8, Google, Clean Code) to construct contextual prompt payloads.
3. **Multi-Agent Pipeline**: Distributes incoming source files to specialized AI agents (Security Auditor, Performance Architect, QA Debugger, Complexity Reviewer) which analyze code concurrently. A Supervisor Agent deduplicates findings and scores the codebase out of 100.
4. **Interactive Monaco Workspace**: Side-by-side diff editors with color-coded line decorations, instant line-focusing on clicked findings, and click-to-apply code patches.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Single Page Application (SPA), Tailwind CSS, Monaco Editor Core, Lucide Icons, Google Fonts (Outfit, Inter, JetBrains Mono) |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0, JWT, Python AST compiler |
| **Database & Cache** | SQLite (Local fallback), PostgreSQL (Production-ready), Redis (Caching) |
| **Orchestration** | Docker, Docker Compose |

---

## 📁 System Architecture

```
codemind-ai/
├── docker-compose.yml       # Production container configuration
├── README.md                # Documentation guide
└── backend/                 # FastAPI REST Engine
    ├── Dockerfile
    ├── requirements.txt
    ├── app/
    │   ├── main.py          # App initialization and auto-seeder
    │   ├── core/
    │   │   ├── config.py    # Environment variables settings loader
    │   │   └── security.py  # Password hashing and JWT generation
    │   ├── database/
    │   │   └── session.py   # SQLAlchemy session manager (SQLite fallback)
    │   ├── models/          # Database entities (User, Review, Project)
    │   ├── schemas/         # Pydantic payloads validation
    │   ├── services/
    │   │   ├── static_analysis.py  # AST static linter parser
    │   │   └── report_generator.py # Formats reviews as HTML/Markdown
    │   ├── ai/
    │   │   ├── agents.py           # Specialist AI models configuration
    │   │   ├── agent_supervisor.py # Multi-agent deduplicator and scorer
    │   │   ├── rag_engine.py       # Local semantic vector indexer
    │   │   └── prompts.py          # Prompt templates definitions
    │   └── api/
    │       ├── deps.py             # JWT bearer verification dependencies
    │       └── v1/                 # Endpoints (auth, projects, reviews, chat)
    └── tests/
        └── test_api.py      # Integration testing
```

---

## 📡 Core API Endpoints

### 1. Authentication
* **`POST /api/v1/auth/register`**: Registers new developers.
* **`POST /api/v1/auth/login`**: OAuth2-compatible form authentication returning a bearer token.
* **`GET /api/v1/auth/me`**: Fetches active user details.

### 2. Projects & Repositories
* **`POST /api/v1/projects/`**: Creates a project workspace.
* **`GET /api/v1/projects/`**: Lists user projects.
* **`DELETE /api/v1/projects/{id}`**: Deletes project workspace.

### 3. Audits & Reports
* **`POST /api/v1/reviews/`**: Triggers a review on raw code paste.
* **`GET /api/v1/reviews/`**: Lists completed audit reviews.
* **`GET /api/v1/reviews/{id}/html`**: Downloads a premium styled HTML print report.
* **`GET /api/v1/reviews/{id}/markdown`**: Downloads a Markdown review summary.

### 4. Repository Chat
* **`POST /api/v1/chat/`**: Sends a question with repository context and retrieves semantic code answers.

---

## ⚙️ Setup & Installation

### Local Execution (FastAPI + Python web server)

#### 1. Start the Backend:
```bash
cd backend

# Create virtual environment and activate
python3 -m venv .venv
source .venv/bin/activate

# Install libraries
pip install -r requirements.txt

# Launch FastAPI web engine
uvicorn app.main:app --reload --port 8000
```
*The database automatically creates schemas and seeds mock projects and audit records on startup!*

#### 2. Start the Frontend:
```bash
cd ../frontend
python3 -m http.server 3000
```
Open **`http://localhost:3000`** in your browser.

#### 3. Log In:
* **Email:** `dev@codemind.ai`
* **Password:** `password123`

---

## 🧪 Running Integration Tests
Validate endpoints and database connections by running the pytest suite:
```bash
cd backend
pytest
```
