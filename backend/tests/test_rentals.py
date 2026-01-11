"""Tests for rental endpoints."""
import pytest
from fastapi.testclient import TestClient
from datetime import date, timedelta


def create_test_car(client: TestClient, status: str = "AVAILABLE") -> int:
    """Helper function to create a test car."""
    car_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2021,
        "imageUrl": "https://example.com/camry.jpg",
        "status": status,
        "dailyRate": 50.00
    }
    response = client.post("/api/cars", json=car_data)
    return response.json()["id"]


def create_test_customer(client: TestClient) -> int:
    """Helper function to create a test customer."""
    customer_data = {
        "name": "John Doe",
        "email": f"john{date.today().isoformat()}@example.com",
        "phone": "+1-555-1234",
        "licenseNumber": f"JD-{date.today().isoformat()}"
    }
    response = client.post("/api/customers", json=customer_data)
    return response.json()["id"]


def test_create_rental_success(client: TestClient):
    """Test successful rental creation."""
    car_id = create_test_car(client)
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    response = client.post("/api/rentals", json=rental_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["carId"] == car_id
    assert data["customerId"] == customer_id
    assert data["totalCost"] == 150.00  # 3 days * $50
    assert "id" in data
    
    # Verify car status changed to RENTED
    car_response = client.get(f"/api/cars/{car_id}")
    assert car_response.json()["status"] == "RENTED"


def test_create_rental_invalid_date_range(client: TestClient):
    """Test rental creation with end date before start date."""
    car_id = create_test_car(client)
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date - timedelta(days=1)  # End before start
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    response = client.post("/api/rentals", json=rental_data)
    assert response.status_code == 422  # Validation error


def test_create_rental_car_not_found(client: TestClient):
    """Test rental creation with non-existent car."""
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": 9999,  # Non-existent car
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    response = client.post("/api/rentals", json=rental_data)
    assert response.status_code == 404


def test_create_rental_customer_not_found(client: TestClient):
    """Test rental creation with non-existent customer."""
    car_id = create_test_car(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": car_id,
        "customerId": 9999,  # Non-existent customer
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    response = client.post("/api/rentals", json=rental_data)
    assert response.status_code == 404


def test_create_rental_car_not_available(client: TestClient):
    """Test rental creation with unavailable car."""
    car_id = create_test_car(client, status="MAINTENANCE")
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    response = client.post("/api/rentals", json=rental_data)
    assert response.status_code == 400
    assert "not available" in response.json()["detail"].lower()


def test_cost_calculation(client: TestClient):
    """Test rental cost calculation."""
    car_id = create_test_car(client)
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=5)
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    response = client.post("/api/rentals", json=rental_data)
    assert response.status_code == 201
    
    data = response.json()
    assert data["totalCost"] == 250.00  # 5 days * $50


def test_get_all_rentals(client: TestClient):
    """Test getting all rentals."""
    car_id = create_test_car(client)
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    client.post("/api/rentals", json=rental_data)
    
    response = client.get("/api/rentals")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) >= 1


def test_get_rental_by_id(client: TestClient):
    """Test getting a rental by ID."""
    car_id = create_test_car(client)
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    create_response = client.post("/api/rentals", json=rental_data)
    rental_id = create_response.json()["id"]
    
    response = client.get(f"/api/rentals/{rental_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == rental_id


def test_update_rental_to_completed(client: TestClient):
    """Test updating rental status to completed."""
    car_id = create_test_car(client)
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    create_response = client.post("/api/rentals", json=rental_data)
    rental_id = create_response.json()["id"]
    
    update_data = {
        "status": "COMPLETED"
    }
    
    response = client.put(f"/api/rentals/{rental_id}", json=update_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "COMPLETED"
    
    # Verify car status changed back to AVAILABLE
    car_response = client.get(f"/api/cars/{car_id}")
    assert car_response.json()["status"] == "AVAILABLE"


def test_delete_rental(client: TestClient):
    """Test deleting a rental."""
    car_id = create_test_car(client)
    customer_id = create_test_customer(client)
    
    start_date = date.today()
    end_date = start_date + timedelta(days=3)
    
    rental_data = {
        "carId": car_id,
        "customerId": customer_id,
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "status": "ACTIVE"
    }
    
    create_response = client.post("/api/rentals", json=rental_data)
    rental_id = create_response.json()["id"]
    
    response = client.delete(f"/api/rentals/{rental_id}")
    assert response.status_code == 204
    
    # Verify rental is deleted
    get_response = client.get(f"/api/rentals/{rental_id}")
    assert get_response.status_code == 404
    
    # Verify car status changed back to AVAILABLE
    car_response = client.get(f"/api/cars/{car_id}")
    assert car_response.json()["status"] == "AVAILABLE"
