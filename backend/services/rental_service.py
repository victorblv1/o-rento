"""Rental service with business logic."""
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException
from datetime import date

from backend.models import Rental, RentalStatus, Car, CarStatus, Customer
from backend.schemas import RentalCreate, RentalUpdate


class RentalService:
    """Service for rental-related operations."""

    @staticmethod
    def get_all(db: Session) -> List[Rental]:
        """Get all rentals."""
        return db.query(Rental).all()

    @staticmethod
    def get_by_id(db: Session, rental_id: int) -> Rental:
        """Get rental by ID."""
        rental = db.query(Rental).filter(Rental.id == rental_id).first()
        if not rental:
            raise HTTPException(status_code=404, detail=f"Rental with id {rental_id} not found")
        return rental

    @staticmethod
    def _calculate_total_cost(start_date: date, end_date: date, daily_rate: float) -> float:
        """Calculate total cost based on date range and daily rate."""
        # Inclusive of start, exclusive of end
        days = (end_date - start_date).days
        if days < 1:
            days = 1  # Minimum 1 day
        return days * daily_rate

    @staticmethod
    def create(db: Session, rental_data: RentalCreate) -> Rental:
        """Create a new rental."""
        # Verify car exists
        car = db.query(Car).filter(Car.id == rental_data.carId).first()
        if not car:
            raise HTTPException(status_code=404, detail=f"Car with id {rental_data.carId} not found")
        
        # Verify customer exists
        customer = db.query(Customer).filter(Customer.id == rental_data.customerId).first()
        if not customer:
            raise HTTPException(status_code=404, detail=f"Customer with id {rental_data.customerId} not found")
        
        # Check if car is available
        if car.status != CarStatus.AVAILABLE:
            raise HTTPException(
                status_code=400,
                detail=f"Car is not available for rental. Current status: {car.status.value}"
            )
        
        # Calculate total cost
        total_cost = RentalService._calculate_total_cost(
            rental_data.startDate,
            rental_data.endDate,
            car.dailyRate
        )
        
        # Create rental
        rental = Rental(
            carId=rental_data.carId,
            customerId=rental_data.customerId,
            startDate=rental_data.startDate,
            endDate=rental_data.endDate,
            status=rental_data.status,
            totalCost=total_cost
        )
        
        # Update car status to RENTED if rental is ACTIVE
        if rental.status == RentalStatus.ACTIVE:
            car.status = CarStatus.RENTED
        
        db.add(rental)
        db.commit()
        db.refresh(rental)
        return rental

    @staticmethod
    def update(db: Session, rental_id: int, rental_data: RentalUpdate) -> Rental:
        """Update an existing rental."""
        rental = RentalService.get_by_id(db, rental_id)
        
        update_data = rental_data.model_dump(exclude_unset=True)
        
        # If carId is being updated, verify the new car exists
        if "carId" in update_data:
            car = db.query(Car).filter(Car.id == update_data["carId"]).first()
            if not car:
                raise HTTPException(status_code=404, detail=f"Car with id {update_data['carId']} not found")
        
        # If customerId is being updated, verify the new customer exists
        if "customerId" in update_data:
            customer = db.query(Customer).filter(Customer.id == update_data["customerId"]).first()
            if not customer:
                raise HTTPException(status_code=404, detail=f"Customer with id {update_data['customerId']} not found")
        
        # Track old status and car
        old_status = rental.status
        old_car_id = rental.carId
        
        # Apply updates
        for field, value in update_data.items():
            setattr(rental, field, value)
        
        # Recalculate total cost if dates changed
        if "startDate" in update_data or "endDate" in update_data or "carId" in update_data:
            car = db.query(Car).filter(Car.id == rental.carId).first()
            rental.totalCost = RentalService._calculate_total_cost(
                rental.startDate,
                rental.endDate,
                car.dailyRate
            )
        
        # Update car status based on rental status changes
        if "status" in update_data and update_data["status"] != old_status:
            car = db.query(Car).filter(Car.id == rental.carId).first()
            
            if update_data["status"] in [RentalStatus.COMPLETED, RentalStatus.CANCELLED]:
                # Set car back to available
                car.status = CarStatus.AVAILABLE
            elif update_data["status"] == RentalStatus.ACTIVE:
                # Set car to rented
                car.status = CarStatus.RENTED
        
        db.commit()
        db.refresh(rental)
        return rental

    @staticmethod
    def delete(db: Session, rental_id: int) -> None:
        """Delete a rental."""
        rental = RentalService.get_by_id(db, rental_id)
        
        # If rental was active, set car back to available
        if rental.status == RentalStatus.ACTIVE:
            car = db.query(Car).filter(Car.id == rental.carId).first()
            if car:
                car.status = CarStatus.AVAILABLE
        
        db.delete(rental)
        db.commit()
