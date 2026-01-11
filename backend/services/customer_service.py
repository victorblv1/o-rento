"""Customer service with business logic."""
from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException

from backend.models import Customer
from backend.schemas import CustomerCreate, CustomerUpdate


class CustomerService:
    """Service for customer-related operations."""

    @staticmethod
    def get_all(db: Session) -> List[Customer]:
        """Get all customers."""
        return db.query(Customer).all()

    @staticmethod
    def get_by_id(db: Session, customer_id: int) -> Customer:
        """Get customer by ID."""
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail=f"Customer with id {customer_id} not found")
        return customer

    @staticmethod
    def create(db: Session, customer_data: CustomerCreate) -> Customer:
        """Create a new customer."""
        # Check for duplicate email
        existing = db.query(Customer).filter(Customer.email == customer_data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check for duplicate license number
        existing = db.query(Customer).filter(Customer.licenseNumber == customer_data.licenseNumber).first()
        if existing:
            raise HTTPException(status_code=400, detail="License number already registered")
        
        customer = Customer(**customer_data.model_dump())
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def update(db: Session, customer_id: int, customer_data: CustomerUpdate) -> Customer:
        """Update an existing customer."""
        customer = CustomerService.get_by_id(db, customer_id)
        
        update_data = customer_data.model_dump(exclude_unset=True)
        
        # Check for duplicate email if updating
        if "email" in update_data:
            existing = db.query(Customer).filter(
                Customer.email == update_data["email"],
                Customer.id != customer_id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check for duplicate license number if updating
        if "licenseNumber" in update_data:
            existing = db.query(Customer).filter(
                Customer.licenseNumber == update_data["licenseNumber"],
                Customer.id != customer_id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="License number already registered")
        
        for field, value in update_data.items():
            setattr(customer, field, value)
        
        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def delete(db: Session, customer_id: int) -> None:
        """Delete a customer."""
        customer = CustomerService.get_by_id(db, customer_id)
        db.delete(customer)
        db.commit()
