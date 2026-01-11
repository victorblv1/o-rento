"""SQLAlchemy ORM models."""
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from backend.db import Base


class CarStatus(str, enum.Enum):
    """Car status enumeration."""
    AVAILABLE = "AVAILABLE"
    RENTED = "RENTED"
    MAINTENANCE = "MAINTENANCE"


class RentalStatus(str, enum.Enum):
    """Rental status enumeration."""
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Car(Base):
    """Car entity model."""
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    imageUrl = Column(String, nullable=False)
    status = Column(SQLEnum(CarStatus), nullable=False, default=CarStatus.AVAILABLE)
    dailyRate = Column(Float, nullable=False)


class Customer(Base):
    """Customer entity model."""
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String(20), nullable=True)
    licenseNumber = Column(String(50), nullable=False, unique=True)


class Rental(Base):
    """Rental entity model."""
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True)
    carId = Column(Integer, ForeignKey("cars.id"), nullable=False)
    customerId = Column(Integer, ForeignKey("customers.id"), nullable=False)
    startDate = Column(Date, nullable=False)
    endDate = Column(Date, nullable=False)
    status = Column(SQLEnum(RentalStatus), nullable=False, default=RentalStatus.ACTIVE)
    totalCost = Column(Float, nullable=False)

    # Relationships
    car = relationship("Car")
    customer = relationship("Customer")
