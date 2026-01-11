"""Tests for customer endpoints."""
import pytest
from fastapi.testclient import TestClient


def test_create_customer_success(client: TestClient):
    """Test successful customer creation."""
    customer_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    response = client.post("/api/customers", json=customer_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert data["licenseNumber"] == "JD-123456"
    assert "id" in data


def test_create_customer_invalid_email(client: TestClient):
    """Test customer creation with invalid email."""
    customer_data = {
        "name": "John Doe",
        "email": "not-an-email",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    response = client.post("/api/customers", json=customer_data)
    assert response.status_code == 422  # Validation error


def test_create_customer_name_too_long(client: TestClient):
    """Test customer creation with name exceeding max length."""
    customer_data = {
        "name": "A" * 101,  # Exceeds 100 character limit
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    response = client.post("/api/customers", json=customer_data)
    assert response.status_code == 422  # Validation error


def test_create_customer_duplicate_email(client: TestClient):
    """Test customer creation with duplicate email."""
    customer_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    # Create first customer
    client.post("/api/customers", json=customer_data)
    
    # Try to create second customer with same email
    customer_data2 = {
        "name": "Jane Doe",
        "email": "john@example.com",  # Same email
        "phone": "+1-555-5678",
        "licenseNumber": "JD-654321"
    }
    
    response = client.post("/api/customers", json=customer_data2)
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_create_customer_duplicate_license(client: TestClient):
    """Test customer creation with duplicate license number."""
    customer_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    # Create first customer
    client.post("/api/customers", json=customer_data)
    
    # Try to create second customer with same license
    customer_data2 = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1-555-5678",
        "licenseNumber": "JD-123456"  # Same license
    }
    
    response = client.post("/api/customers", json=customer_data2)
    assert response.status_code == 400
    assert "License number already registered" in response.json()["detail"]


def test_get_all_customers(client: TestClient):
    """Test getting all customers."""
    customer1 = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    customer2 = {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1-555-5678",
        "licenseNumber": "JS-654321"
    }
    
    client.post("/api/customers", json=customer1)
    client.post("/api/customers", json=customer2)
    
    response = client.get("/api/customers")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2


def test_get_customer_by_id(client: TestClient):
    """Test getting a customer by ID."""
    customer_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    create_response = client.post("/api/customers", json=customer_data)
    customer_id = create_response.json()["id"]
    
    response = client.get(f"/api/customers/{customer_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == customer_id
    assert data["name"] == "John Doe"


def test_get_customer_not_found(client: TestClient):
    """Test getting a non-existent customer."""
    response = client.get("/api/customers/9999")
    assert response.status_code == 404


def test_update_customer(client: TestClient):
    """Test updating a customer."""
    customer_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    create_response = client.post("/api/customers", json=customer_data)
    customer_id = create_response.json()["id"]
    
    update_data = {
        "phone": "+1-555-9999"
    }
    
    response = client.put(f"/api/customers/{customer_id}", json=update_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["phone"] == "+1-555-9999"
    assert data["name"] == "John Doe"  # Unchanged


def test_delete_customer(client: TestClient):
    """Test deleting a customer."""
    customer_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": "JD-123456"
    }
    
    create_response = client.post("/api/customers", json=customer_data)
    customer_id = create_response.json()["id"]
    
    response = client.delete(f"/api/customers/{customer_id}")
    assert response.status_code == 204
    
    # Verify customer is deleted
    get_response = client.get(f"/api/customers/{customer_id}")
    assert get_response.status_code == 404
