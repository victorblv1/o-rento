"""FastAPI main application with CORS and OpenAPI configuration."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.db import init_db, SessionLocal
from backend.seed import seed_database
from backend.routers import cars, customers, rentals


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup: Initialize database and seed data
    print("Initializing database...")
    init_db()
    
    print("Seeding database...")
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    
    yield
    
    # Shutdown: Cleanup if needed
    print("Shutting down...")


# Create FastAPI application
app = FastAPI(
    title="O-Rento Car Rental API",
    description="API for managing car rentals, cars, and customers",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cars.router)
app.include_router(customers.router)
app.include_router(rentals.router)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to O-Rento Car Rental API",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
