import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_login_api():
    response = client.post("/api/v1/auth/login", json={"username": "analyst", "password": "analyst123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_list_jobs_api():
    response = client.get("/api/v1/jobs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
