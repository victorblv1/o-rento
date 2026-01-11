"""Customer router with CRUD endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.db import get_db
from backend.schemas import CustomerCreate, CustomerUpdate, CustomerRead
from backend.services.customer_service import CustomerService

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("", response_model=List[CustomerRead])
def get_all_customers(db: Session = Depends(get_db)):
    """Get all customers."""
    return CustomerService.get_all(db)


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get a customer by ID."""
    return CustomerService.get_by_id(db, customer_id)


@router.post("", response_model=CustomerRead, status_code=201)
def create_customer(customer_data: CustomerCreate, db: Session = Depends(get_db)):
    """Create a new customer."""
    return CustomerService.create(db, customer_data)


@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(customer_id: int, customer_data: CustomerUpdate, db: Session = Depends(get_db)):
    """Update an existing customer."""
    return CustomerService.update(db, customer_id, customer_data)


@router.delete("/{customer_id}", status_code=204)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """Delete a customer."""
    CustomerService.delete(db, customer_id)
    return None
