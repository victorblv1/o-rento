"""Seed initial data into the database."""
from sqlalchemy.orm import Session

from backend.models import Car, CarStatus, Customer


def seed_database(db: Session):
    """Seed initial data idempotently."""
    
    # Check if data already exists
    existing_cars = db.query(Car).count()
    existing_customers = db.query(Customer).count()
    
    if existing_cars > 0 and existing_customers > 0:
        print("Database already seeded. Skipping...")
        return
    
    # Seed cars if none exist
    if existing_cars == 0:
        cars = [
            Car(
                make="Toyota",
                model="Corolla",
                year=2020,
                imageUrl="https://images.toyota.com/corolla.jpg",
                status=CarStatus.AVAILABLE,
                dailyRate=39.99
            ),
            Car(
                make="Tesla",
                model="Model 3",
                year=2022,
                imageUrl="https://www.tesla.com/model3.jpg",
                status=CarStatus.MAINTENANCE,
                dailyRate=89.00
            ),
            Car(
                make="Ford",
                model="Focus",
                year=2019,
                imageUrl="https://www.ford.com/focus.jpg",
                status=CarStatus.AVAILABLE,
                dailyRate=29.50
            ),
            Car(
                make="Honda",
                model="Civic",
                year=2021,
                imageUrl="https://www.honda.com/civic.jpg",
                status=CarStatus.AVAILABLE,
                dailyRate=42.00
            ),
            Car(
                make="BMW",
                model="3 Series",
                year=2023,
                imageUrl="https://www.bmw.com/3series.jpg",
                status=CarStatus.AVAILABLE,
                dailyRate=95.00
            ),
        ]
        
        for car in cars:
            db.add(car)
        
        print(f"Seeded {len(cars)} cars.")
    
    # Seed customers if none exist
    if existing_customers == 0:
        customers = [
            Customer(
                name="Alice Johnson",
                email="alice@example.com",
                phone="+1-202-555-0111",
                licenseNumber="ALJ-12345"
            ),
            Customer(
                name="Bob Smith",
                email="bob@example.com",
                phone="+1-202-555-0199",
                licenseNumber="BSM-98765"
            ),
            Customer(
                name="Charlie Davis",
                email="charlie@example.com",
                phone="+1-202-555-0123",
                licenseNumber="CDD-54321"
            ),
        ]
        
        for customer in customers:
            db.add(customer)
        
        print(f"Seeded {len(customers)} customers.")
    
    db.commit()
    print("Database seeding completed.")
