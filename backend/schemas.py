"""Pydantic schemas for validation."""
from pydantic import BaseModel, HttpUrl, EmailStr, Field, field_validator, ConfigDict
from typing import Optional
from datetime import date, datetime

from backend.models import CarStatus, RentalStatus


# ============= Car Schemas =============

class CarCreate(BaseModel):
    """Schema for creating a car."""
    make: str = Field(..., min_length=1)
    model: str = Field(..., min_length=1)
    year: int = Field(..., ge=1900)
    imageUrl: HttpUrl
    status: CarStatus = CarStatus.AVAILABLE
    dailyRate: float = Field(..., ge=0)

    @field_validator('year')
    @classmethod
    def validate_year(cls, v: int) -> int:
        """Validate year is not in the future beyond next year."""
        current_year = datetime.now().year
        if v > current_year + 1:
            raise ValueError(f"Year must be between 1900 and {current_year + 1}")
        return v


class CarUpdate(BaseModel):
    """Schema for updating a car."""
    make: Optional[str] = Field(None, min_length=1)
    model: Optional[str] = Field(None, min_length=1)
    year: Optional[int] = Field(None, ge=1900)
    imageUrl: Optional[HttpUrl] = None
    status: Optional[CarStatus] = None
    dailyRate: Optional[float] = Field(None, ge=0)

    @field_validator('year')
    @classmethod
    def validate_year(cls, v: Optional[int]) -> Optional[int]:
        """Validate year is not in the future beyond next year."""
        if v is not None:
            current_year = datetime.now().year
            if v > current_year + 1:
                raise ValueError(f"Year must be between 1900 and {current_year + 1}")
        return v


class CarRead(BaseModel):
    """Schema for car response."""
    id: int
    make: str
    model: str
    year: int
    imageUrl: str
    status: CarStatus
    dailyRate: float

    model_config = ConfigDict(from_attributes=True)


# ============= Customer Schemas =============

class CustomerCreate(BaseModel):
    """Schema for creating a customer."""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    licenseNumber: str = Field(..., min_length=1, max_length=50)


class CustomerUpdate(BaseModel):
    """Schema for updating a customer."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    licenseNumber: Optional[str] = Field(None, min_length=1, max_length=50)


class CustomerRead(BaseModel):
    """Schema for customer response."""
    id: int
    name: str
    email: str
    phone: Optional[str]
    licenseNumber: str

    model_config = ConfigDict(from_attributes=True)


# ============= Rental Schemas =============

class RentalCreate(BaseModel):
    """Schema for creating a rental."""
    carId: int = Field(..., gt=0)
    customerId: int = Field(..., gt=0)
    startDate: date
    endDate: date
    status: RentalStatus = RentalStatus.ACTIVE

    @field_validator('endDate')
    @classmethod
    def validate_end_date(cls, v: date, info) -> date:
        """Validate end date is not before start date."""
        if 'startDate' in info.data and v < info.data['startDate']:
            raise ValueError("endDate must be >= startDate")
        return v


class RentalUpdate(BaseModel):
    """Schema for updating a rental."""
    carId: Optional[int] = Field(None, gt=0)
    customerId: Optional[int] = Field(None, gt=0)
    startDate: Optional[date] = None
    endDate: Optional[date] = None
    status: Optional[RentalStatus] = None
    totalCost: Optional[float] = Field(None, ge=0)


class RentalRead(BaseModel):
    """Schema for rental response."""
    id: int
    carId: int
    customerId: int
    startDate: date
    endDate: date
    status: RentalStatus
    totalCost: float

    model_config = ConfigDict(from_attributes=True)
