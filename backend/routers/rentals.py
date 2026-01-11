"""Rental router with CRUD endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.db import get_db
from backend.schemas import RentalCreate, RentalUpdate, RentalRead
from backend.services.rental_service import RentalService

router = APIRouter(prefix="/api/rentals", tags=["rentals"])


@router.get("", response_model=List[RentalRead])
def get_all_rentals(db: Session = Depends(get_db)):
    """Get all rentals."""
    return RentalService.get_all(db)


@router.get("/{rental_id}", response_model=RentalRead)
def get_rental(rental_id: int, db: Session = Depends(get_db)):
    """Get a rental by ID."""
    return RentalService.get_by_id(db, rental_id)


@router.post("", response_model=RentalRead, status_code=201)
def create_rental(rental_data: RentalCreate, db: Session = Depends(get_db)):
    """Create a new rental."""
    return RentalService.create(db, rental_data)


@router.put("/{rental_id}", response_model=RentalRead)
def update_rental(rental_id: int, rental_data: RentalUpdate, db: Session = Depends(get_db)):
    """Update an existing rental."""
    return RentalService.update(db, rental_id, rental_data)


@router.delete("/{rental_id}", status_code=204)
def delete_rental(rental_id: int, db: Session = Depends(get_db)):
    """Delete a rental."""
    RentalService.delete(db, rental_id)
    return None
