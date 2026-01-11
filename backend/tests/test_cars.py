"""Tests for car endpoints."""
import pytest
from fastapi.testclient import TestClient


def test_create_car_success(client: TestClient):
    """Test successful car creation."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "https://example.com/camry.jpg",
        "status": "AVAILABLE",
        "dailyRate": 45.00
    }
    
    response = client.post("/api/cars", json=car_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["year"] == 2021
    assert data["dailyRate"] == 45.00
    assert "id" in data


def test_create_car_invalid_year(client: TestClient):
    """Test car creation with invalid year."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 1800,  # Before 1900
        "imageUrl": "https://example.com/camry.jpg",
        "status": "AVAILABLE",
        "dailyRate": 45.00
    }
    
    response = client.post("/api/cars", json=car_data)
    assert response.status_code == 422  # Validation error


def test_create_car_invalid_url(client: TestClient):
    """Test car creation with invalid URL."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "not-a-valid-url",
        "status": "AVAILABLE",
        "dailyRate": 45.00
    }
    
    response = client.post("/api/cars", json=car_data)
    assert response.status_code == 422  # Validation error


def test_create_car_negative_daily_rate(client: TestClient):
    """Test car creation with negative daily rate."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "https://example.com/camry.jpg",
        "status": "AVAILABLE",
        "dailyRate": -10.00
    }
    
    response = client.post("/api/cars", json=car_data)
    assert response.status_code == 422  # Validation error


def test_get_all_cars(client: TestClient):
    """Test getting all cars."""
    # Create two cars
    car1 = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "https://example.com/camry.jpg",
        "status": "AVAILABLE",
        "dailyRate": 45.00
    }
    car2 = {
        "make": "Honda",
        "model": "Accord",
        "year": 2022,
        "imageUrl": "https://example.com/accord.jpg",
        "status": "MAINTENANCE",
        "dailyRate": 50.00
    }
    
    client.post("/api/cars", json=car1)
    client.post("/api/cars", json=car2)
    
    response = client.get("/api/cars")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2


def test_get_car_by_id(client: TestClient):
    """Test getting a car by ID."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "https://example.com/camry.jpg",
        "status": "AVAILABLE",
        "dailyRate": 45.00
    }
    
    create_response = client.post("/api/cars", json=car_data)
    car_id = create_response.json()["id"]
    
    response = client.get(f"/api/cars/{car_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == car_id
    assert data["make"] == "Toyota"


def test_get_car_not_found(client: TestClient):
    """Test getting a non-existent car."""
    response = client.get("/api/cars/9999")
    assert response.status_code == 404


def test_update_car(client: TestClient):
    """Test updating a car."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "https://example.com/camry.jpg",
        "status": "AVAILABLE",
        "dailyRate": 45.00
    }
    
    create_response = client.post("/api/cars", json=car_data)
    car_id = create_response.json()["id"]
    
    update_data = {
        "dailyRate": 55.00,
        "status": "MAINTENANCE"
    }
    
    response = client.put(f"/api/cars/{car_id}", json=update_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["dailyRate"] == 55.00
    assert data["status"] == "MAINTENANCE"
    assert data["make"] == "Toyota"  # Unchanged fields remain


def test_delete_car(client: TestClient):
    """Test deleting a car."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "https://example.com/camry.jpg",
        "status": "AVAILABLE",
        "dailyRate": 45.00
    }
    
    create_response = client.post("/api/cars", json=car_data)
    car_id = create_response.json()["id"]
    
    response = client.delete(f"/api/cars/{car_id}")
    assert response.status_code == 204
    
    # Verify car is deleted
    get_response = client.get(f"/api/cars/{car_id}")
    assert get_response.status_code == 404


def test_delete_car_not_found(client: TestClient):
    """Test deleting a non-existent car."""
    response = client.delete("/api/cars/9999")
    assert response.status_code == 404
