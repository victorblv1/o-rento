"""Car router with CRUD endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.db import get_db
from backend.schemas import CarCreate, CarUpdate, CarRead
from backend.services.car_service import CarService

router = APIRouter(prefix="/api/cars", tags=["cars"])


@router.get("", response_model=List[CarRead])
def get_all_cars(db: Session = Depends(get_db)):
    """Get all cars."""
    return CarService.get_all(db)


@router.get("/{car_id}", response_model=CarRead)
def get_car(car_id: int, db: Session = Depends(get_db)):
    """Get a car by ID."""
    return CarService.get_by_id(db, car_id)


@router.post("", response_model=CarRead, status_code=201)
def create_car(car_data: CarCreate, db: Session = Depends(get_db)):
    """Create a new car."""
    return CarService.create(db, car_data)


@router.put("/{car_id}", response_model=CarRead)
def update_car(car_id: int, car_data: CarUpdate, db: Session = Depends(get_db)):
    """Update an existing car."""
    return CarService.update(db, car_id, car_data)


@router.delete("/{car_id}", status_code=204)
def delete_car(car_id: int, db: Session = Depends(get_db)):
    """Delete a car."""
    CarService.delete(db, car_id)
    return None
