from app.database.session import SessionLocal, Base, engine
from app.domain.models.user import User
from app.domain.models.organization import Organization, OrganizationMember
from app.domain.models.project import Project
from app.domain.models.repository import Repository
from app.domain.models.review import Review, ReviewResult
from app.domain.models.finding import Finding
from app.domain.models.chat import ChatMessage
from app.domain.models.audit_log import AuditLog
from app.core.container import Container
from app.core.security import get_password_hash

# Sample Test Case 1: Critical SQL Injection & Hardcoded Secret
TEST_CASE_1_CODE = """import sqlite3

def authenticate_user(user_input, password_input):
    # Hardcoded credential secret
    JWT_SECRET = "sk-live-secret-token-998877"
    
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    
    # Raw SQL Injection concatenation
    cursor.execute("SELECT * FROM users WHERE username = '" + user_input + "' AND pass = '" + password_input + "'")
    return cursor.fetchone()
"""

# Sample Test Case 2: Bare Exception Swallowing & API Key Leak
TEST_CASE_2_CODE = """import requests

def get_billing_info(account_id):
    API_SECRET_KEY = "sk_test_51Mz00000000000000000"
    try:
        resp = requests.get("https://api.stripe.com/v1/customers/" + account_id)
        return resp.json()
    except:
        # Bare generic exception swallowing errors
        pass
"""

# Sample Test Case 3: Clean & Secure Parameterized Code
TEST_CASE_3_CODE = """import os
import logging
import sqlite3

logger = logging.getLogger(__name__)

def fetch_secure_user(user_id: int):
    jwt_secret = os.getenv("JWT_SECRET")
    if not jwt_secret:
        raise ValueError("JWT_SECRET missing in environment")
        
    conn = sqlite3.connect("secure.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, email FROM users WHERE id = %s", (user_id,))
    return cursor.fetchone()
"""

def main():
    print("==================================================")
    print("  CodeMind AI — Sample Test Cases Runner         ")
    print("==================================================")
    
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Setup container & default user
        container = Container(db)
        user = container.user_repo.get_by_email("dev@codemind.ai")
        if not user:
            user = container.user_repo.create("dev@codemind.ai", get_password_hash("password123"), "Alex Mercer")
            
        project = container.project_repo.get_by_id(1)
        if not project:
            project = container.project_repo.create_project("Test Workspace", "Automated verification workspace", user.id)

        test_cases = [
            ("Test Case 1: Critical SQL Injection & Secret Token", TEST_CASE_1_CODE, "auth_service.py"),
            ("Test Case 2: Bare Exception Swallowing & Secret Key", TEST_CASE_2_CODE, "stripe_billing.py"),
            ("Test Case 3: Clean Secure Parameterized Code", TEST_CASE_3_CODE, "user_repository.py")
        ]

        for title, code, filename in test_cases:
            print(f"\n---> Running {title} ({filename})...")
            res = container.create_review_uc.execute(
                project_id=project.id,
                code=code,
                file_path=filename,
                actor_email=user.email
            )
            print(f"     Status: {res['status']}")
            print(f"     Overall Score: {res['overall_score']} / 100")
            print(f"     Security Score: {res['security_score']} / 100")
            print(f"     Vulnerabilities Found: {res['results_count']}")

        print("\n==================================================")
        print("  All Sample Test Cases Executed Successfully!    ")
        print("==================================================")

    finally:
        db.close()

if __name__ == "__main__":
    main()
