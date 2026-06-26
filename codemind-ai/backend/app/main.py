import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.database.session import Base, engine, SessionLocal
from app.models.user import User
from app.models.project import Project
from app.models.repository import Repository
from app.models.review import Review, ReviewResult
from app.core.security import get_password_hash

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize DB tables (SQLite auto-migration helper)
logger.info("Initializing database tables...")
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Startup Seeding logic
@app.on_event("startup")
def seed_mock_data():
    db = SessionLocal()
    try:
        # Check if database is already seeded
        user_count = db.query(User).count()
        if user_count > 0:
            logger.info("Database already seeded. Skipping initial mockup data injection.")
            return
            
        logger.info("Database empty. Seeding CodeMind AI premium mock data...")
        
        # 1. Create Default Developer
        hashed_pwd = get_password_hash("password123")
        dev_user = User(
            email="dev@codemind.ai",
            hashed_password=hashed_pwd,
            full_name="Alex Mercer",
            role="developer"
        )
        db.add(dev_user)
        db.commit()
        db.refresh(dev_user)
        
        # 2. Create Projects
        project1 = Project(
            name="Vulnerability Playground",
            description="Audit tests for OWASP Top 10 vulnerabilities, AST parser validations, and dependency analysis.",
            owner_id=dev_user.id
        )
        project2 = Project(
            name="Cloud Microservice Core",
            description="Core payment integrations, JWT authorization service, and Redis transaction queue adapter.",
            owner_id=dev_user.id
        )
        db.add_all([project1, project2])
        db.commit()
        db.refresh(project1)
        db.refresh(project2)
        
        # 3. Create Repositories
        repo1 = Repository(
            name="vuln-node-api",
            git_url="https://github.com/codemind-ai/vuln-node-api.git",
            branch="master",
            project_id=project1.id
        )
        repo2 = Repository(
            name="payment-gateway",
            git_url="https://github.com/codemind-ai/payment-gateway.git",
            branch="main",
            project_id=project2.id
        )
        db.add_all([repo1, repo2])
        db.commit()
        db.refresh(repo1)
        db.refresh(repo2)
        
        # 4. Create Mock Reviews & Findings
        # Review 1 (Critical issues)
        review1 = Review(
            project_id=project1.id,
            repository_id=repo1.id,
            status="COMPLETED",
            overall_score=58,
            security_score=35,
            performance_score=70,
            bugs_score=60,
            complexity_score=65,
            doc_score=60,
            commit_sha="a9c18f2d"
        )
        db.add(review1)
        db.commit()
        db.refresh(review1)
        
        res1 = ReviewResult(
            review_id=review1.id,
            file_path="routes/auth.py",
            line_number=24,
            category="security",
            severity="critical",
            message="SQL Injection Vulnerability. Formatted f-string variables directly inserted into SQL query string execution. This permits arbitrary database access.",
            original_code="cursor.execute(f'SELECT * FROM users WHERE email = \"{email}\" AND password = \"{passwd}\"')",
            suggested_code="cursor.execute(\n    'SELECT * FROM users WHERE email = :email AND password = :password',\n    {'email': email, 'password': password}\n)"
        )
        
        res2 = ReviewResult(
            review_id=review1.id,
            file_path="routes/auth.py",
            line_number=8,
            category="security",
            severity="high",
            message="Hardcoded encryption secret found in source code files. Credentials should always be loaded from runtime environmental variables or vault secrets.",
            original_code="JWT_SECRET = 'super-secret-key-321-abc'",
            suggested_code="import os\nJWT_SECRET = os.getenv('JWT_SECRET')"
        )
        
        res3 = ReviewResult(
            review_id=review1.id,
            file_path="utils/parser.js",
            line_number=45,
            category="performance",
            severity="high",
            message="Performance issue: Database connection initialized inside helper loop. Connection pooling should be handled at module lifecycle initialization.",
            original_code="for (let i = 0; i < ids.length; i++) {\n    const client = new Client();\n    await client.connect();\n    ...",
            suggested_code="const client = await pool.connect();\ntry {\n    for (const id of ids) {\n        // run query on same client\n    }\n} finally {\n    client.release();\n}"
        )
        db.add_all([res1, res2, res3])
        
        # Review 2 (Good review)
        review2 = Review(
            project_id=project2.id,
            repository_id=repo2.id,
            status="COMPLETED",
            overall_score=92,
            security_score=95,
            performance_score=90,
            bugs_score=95,
            complexity_score=85,
            doc_score=95,
            commit_sha="7e3d11b2"
        )
        db.add(review2)
        db.commit()
        db.refresh(review2)
        
        res4 = ReviewResult(
            review_id=review2.id,
            file_path="integrations/stripe.py",
            line_number=62,
            category="complexity",
            severity="medium",
            message="Cognitive complexity warning. Function 'process_webhook' contains 4 levels of nested loops and conditional statements. Extract sub-logic into dedicated handlers.",
            original_code="def process_webhook(payload):\n    if payload.type == 'invoice':\n        for line in payload.lines:\n            if line.amount > 0:\n                ...",
            suggested_code="def process_webhook(payload):\n    if payload.type != 'invoice':\n        return\n    _handle_invoice_webhook(payload)"
        )
        
        res5 = ReviewResult(
            review_id=review2.id,
            file_path="integrations/stripe.py",
            line_number=14,
            category="smell",
            severity="info",
            message="Clean Code Smell: Wildcard import statement. Wildcard imports pollute the namespace and reduce file readability.",
            original_code="from stripe.errors import *",
            suggested_code="from stripe.errors import StripeError, CardError, InvalidRequestError"
        )
        db.add_all([res4, res5])
        db.commit()
        
        logger.info("Mock seeding successfully completed.")
        
    except Exception as e:
        logger.error(f"Error seeding mock database: {e}")
        db.rollback()
    finally:
        db.close()
