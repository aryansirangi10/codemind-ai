from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_read_health():
    """
    Test the health check endpoint returns online status.
    """
    response = client.get(f"{settings.API_V1_STR}/health/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "database" in data

def test_auth_registration():
    """
    Test registering a new user is handled correctly.
    """
    email = f"test-dev-{hash('test')}@codemind.ai"
    payload = {
        "email": email,
        "password": "strongpassword123",
        "full_name": "Test Suite Runner",
        "role": "developer"
    }
    
    response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=payload
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["role"] == "developer"
    assert "id" in data
