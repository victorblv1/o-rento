"""Car service with business logic."""
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException

from backend.models import Car
from backend.schemas import CarCreate, CarUpdate


class CarService:
    """Service for car-related operations."""

    @staticmethod
    def get_all(db: Session) -> List[Car]:
        """Get all cars."""
        return db.query(Car).all()

    @staticmethod
    def get_by_id(db: Session, car_id: int) -> Car:
        """Get car by ID."""
        car = db.query(Car).filter(Car.id == car_id).first()
        if not car:
            raise HTTPException(status_code=404, detail=f"Car with id {car_id} not found")
        return car

    @staticmethod
    def create(db: Session, car_data: CarCreate) -> Car:
        """Create a new car."""
        data = car_data.model_dump()
        # Convert HttpUrl to string for SQLAlchemy
        if 'imageUrl' in data:
            data['imageUrl'] = str(data['imageUrl'])
        car = Car(**data)
        db.add(car)
        db.commit()
        db.refresh(car)
        return car

    @staticmethod
    def update(db: Session, car_id: int, car_data: CarUpdate) -> Car:
        """Update an existing car."""
        car = CarService.get_by_id(db, car_id)
        
        update_data = car_data.model_dump(exclude_unset=True)
        # Convert HttpUrl to string for SQLAlchemy
        if 'imageUrl' in update_data:
            update_data['imageUrl'] = str(update_data['imageUrl'])
        for field, value in update_data.items():
            setattr(car, field, value)
        
        db.commit()
        db.refresh(car)
        return car

    @staticmethod
    def delete(db: Session, car_id: int) -> None:
        """Delete a car."""
        car = CarService.get_by_id(db, car_id)
        db.delete(car)
        db.commit()
