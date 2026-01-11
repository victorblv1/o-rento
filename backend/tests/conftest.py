"""Test configuration and fixtures."""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.db import Base, get_db
from backend.routers import cars, customers, rentals


# Create in-memory SQLite database for testing
# Using file: scheme with memory mode and shared cache for multi-threaded access
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///file:testdb?mode=memory&cache=shared&uri=true"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False, "uri": True}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for tests."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@asynccontextmanager
async def test_lifespan(app):
    """Test lifespan that doesn't seed data."""
    # No startup/shutdown actions for tests
    yield


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    """Set up test database before each test."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop all tables
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(setup_database):
    """Create a test client with overridden database."""
    # Create a new app for testing without the production lifespan
    test_app = FastAPI(
        title="O-Rento Car Rental API",
        description="API for managing car rentals, cars, and customers",
        version="1.0.0",
        lifespan=test_lifespan
    )
    
    # Add CORS middleware
    test_app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    test_app.include_router(cars.router)
    test_app.include_router(customers.router)
    test_app.include_router(rentals.router)
    
    # Override the get_db dependency
    test_app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(test_app) as test_client:
        yield test_client
    
    # Clean up
    test_app.dependency_overrides.clear()
