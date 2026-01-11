# O-Rento Car Rental Management Backend

FastAPI-based backend for managing car rentals, cars, and customers.

## Project Structure

```
backend/
├── __init__.py
├── main.py                 # FastAPI app entry point with CORS & lifecycle
├── db.py                   # Database configuration (SQLAlchemy + SQLite)
├── seed.py                 # Initial data seeding (idempotent)
├── models/                 # SQLAlchemy ORM models
│   ├── __init__.py
│   ├── car.py             # Car entity
│   ├── customer.py        # Customer entity
│   └── rental.py          # Rental entity
├── schemas/                # Pydantic validation schemas
│   ├── __init__.py
│   ├── car.py             # Car Create/Update/Response
│   ├── customer.py        # Customer Create/Update/Response
│   └── rental.py          # Rental Create/Update/Response
├── services/               # Business logic layer
│   ├── __init__.py
│   ├── car_service.py
│   ├── customer_service.py
│   └── rental_service.py
├── routers/                # API endpoints
│   ├── __init__.py
│   ├── cars.py            # /api/cars endpoints
│   ├── customers.py       # /api/customers endpoints
│   └── rentals.py         # /api/rentals endpoints
└── tests/                  # Test suite
    ├── __init__.py
    ├── conftest.py        # Pytest configuration
    ├── test_cars.py
    ├── test_customers.py
    └── test_rentals.py
```

## Setup

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd o-rento
```

### 2. Create Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate  # On macOS/Linux
# OR
.venv\Scripts\activate     # On Windows
```

> **Note**: The `.venv` directory is excluded from version control (see `.gitignore`). Each developer/environment must create their own virtual environment.

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

Dependencies:

- `fastapi` - Web framework
- `uvicorn[standard]` - ASGI server
- `sqlalchemy` - ORM
- `pydantic[email]` - Data validation
- `python-multipart` - Form data support
- `pytest` - Testing framework
- `httpx` - HTTP client for tests

### 4. Run the Backend

```bash
uvicorn backend.main:app --reload
```

The server will start on `http://localhost:8000`

- The database (`orento.db`) will be created automatically on first run
- Seed data (5 cars, 3 customers) will be loaded automatically

### 5. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## GitHub Actions CI Setup

For continuous integration, create `.github/workflows/test.yml`:

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.9"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests
        run: |
          pytest -v
```

This workflow:

1. Checks out the code
2. Sets up Python 3.9
3. Creates a fresh virtual environment automatically
4. Installs dependencies from `requirements.txt`
5. Runs the test suite

**Key Point**: Virtual environments are NOT committed to git. The CI system creates a fresh environment on each run using `requirements.txt`.

## API Endpoints

### Cars (`/api/cars`)

- `GET /api/cars` - List all cars
- `GET /api/cars/{id}` - Get car by ID
- `POST /api/cars` - Create new car
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car

### Customers (`/api/customers`)

- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Rentals (`/api/rentals`)

- `GET /api/rentals` - List all rentals
- `GET /api/rentals/{id}` - Get rental by ID
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/{id}` - Update rental
- `DELETE /api/rentals/{id}` - Delete rental

## Data Models

### Car

- `id` - Auto-generated integer
- `make` - String (required)
- `model` - String (required)
- `year` - Integer (1900 to current_year+1)
- `imageUrl` - Valid URL (required)
- `status` - Enum: `AVAILABLE`, `RENTED`, `MAINTENANCE`
- `dailyRate` - Float (>= 0)

### Customer

- `id` - Auto-generated integer
- `name` - String (required, max 100 chars)
- `email` - Valid email (required, unique)
- `phone` - String (optional, max 20 chars)
- `licenseNumber` - String (required, unique, max 50 chars)

### Rental

- `id` - Auto-generated integer
- `carId` - Foreign key to Car
- `customerId` - Foreign key to Customer
- `startDate` - Date
- `endDate` - Date (must be >= startDate)
- `status` - Enum: `ACTIVE`, `COMPLETED`, `CANCELLED`
- `totalCost` - Float (auto-calculated based on dates and car dailyRate)

## Business Rules

1. **Car Rental**: Only cars with status `AVAILABLE` can be rented
2. **Status Management**: When a rental is created with status `ACTIVE`, the car status automatically changes to `RENTED`
3. **Cost Calculation**: Total cost is calculated as `(endDate - startDate) * car.dailyRate` (minimum 1 day)
4. **Completion/Cancellation**: When a rental is marked as `COMPLETED` or `CANCELLED`, the car status returns to `AVAILABLE`
5. **Unique Constraints**: Customer emails and license numbers must be unique

## Database

- **Development**: SQLite file (`orento.db`)
- **Tests**: In-memory SQLite (`:memory:`)
- **Seeding**: Initial data automatically loaded on startup (idempotent)

Initial seed data includes:

- 5 cars (Toyota Corolla, Tesla Model 3, Ford Focus, Honda Civic, BMW 3 Series)
- 3 customers (Alice Johnson, Bob Smith, Charlie Davis)

## Running Tests

```bash
# Activate virtual environment if not already active
source .venv/bin/activate  # macOS/Linux
# OR
.venv\Scripts\activate     # Windows

# Run all tests
pytest -v

# Run specific test file
pytest backend/tests/test_cars.py -v

# Run with coverage
pytest --cov=backend --cov-report=html
```

**Test Status**: ✅ All 30 tests passing

The test suite covers:

- Car CRUD operations and validation (10 tests)
- Customer CRUD operations and validation (10 tests)
- Rental CRUD operations, business logic, and cost calculation (10 tests)

Tests use an isolated in-memory SQLite database with shared cache to ensure proper thread safety.

## CORS Configuration

CORS is enabled for the frontend development server:

- Allowed origin: `http://localhost:5173` (Vite default port)
- All methods and headers allowed

## Development

### Adding New Endpoints

1. Define model in `models/`
2. Create Pydantic schemas in `schemas/`
3. Implement business logic in `services/`
4. Create router in `routers/`
5. Include router in `main.py`
6. Write tests in `tests/`

### Validation

All validation is handled by Pydantic schemas:

- Required fields
- String length limits
- Email format
- URL format
- Numeric ranges
- Date comparisons
- Enum values

Validation errors return HTTP 422 with detailed field-level error messages.

## Next Steps

1. **Fix test database configuration** - Currently tests need adjustment to properly use in-memory SQLite
2. **Add filtering** - Implement query parameters for filtering cars by status, rentals by date, etc.
3. **Add pagination** - For large result sets
4. **Enhanced validation** - Prevent overlapping rentals for the same car
5. **Authentication** - Add JWT-based auth for customers and admins
6. **Documentation** - Add more detailed API documentation with examples
