# O-Rento Frontend

React + TypeScript + MUI frontend for the O-Rento car rental management system.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety with strict mode
- **Vite** - Build tool and dev server
- **Material-UI (MUI) v7** - Component library
- **React Router** - Client-side routing
- **Emotion** - CSS-in-JS styling

## Project Structure

```
src/
├── api/              # API client functions
│   ├── cars.ts       # Cars CRUD operations
│   ├── customers.ts  # Customers CRUD operations
│   └── rentals.ts    # Rentals CRUD operations
├── components/       # Shared components
│   ├── ConfirmDialog.tsx
│   ├── ErrorAlert.tsx
│   ├── LoadingSpinner.tsx
│   └── SuccessAlert.tsx
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── CarListPage.tsx
│   ├── CarFormPage.tsx
│   ├── CustomerListPage.tsx
│   ├── CustomerFormPage.tsx
│   ├── RentalListPage.tsx
│   └── RentalFormPage.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app with routing
└── main.tsx          # Entry point
```

## Features

### Cars Management

- ✅ List all cars with image thumbnails
- ✅ Filter by status (Available, Rented, Maintenance)
- ✅ Search by make or model
- ✅ Add/edit cars with validation
- ✅ Delete cars with confirmation
- ✅ Status chips with color coding

### Customers Management

- ✅ List all customers in table format
- ✅ Search by name, email, or license number
- ✅ Add/edit customers with validation
- ✅ Delete customers with confirmation
- ✅ Email format validation

### Rentals Management

- ✅ List all rentals with calculated duration
- ✅ Filter by status (Active, Completed, Cancelled)
- ✅ Add/edit rentals with date validation
- ✅ Select car and customer from dropdowns
- ✅ Real-time cost calculation
- ✅ Date range validation (end ≥ start)
- ✅ Only available cars shown in dropdown

## Setup

### Prerequisites

- Node.js 18+ and npm
- Backend server running on http://localhost:8000

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## API Integration

The frontend connects to the backend API at `http://localhost:8000/api`.

All API clients are in the `src/api/` directory and use native `fetch` with proper error handling.

## Validation

### Car Form

- Make: Required
- Model: Required
- Year: 1900 to current year + 1
- Image URL: Required, valid URL format
- Daily Rate: >= 0
- Status: AVAILABLE | RENTED | MAINTENANCE

### Customer Form

- Name: Required, max 100 characters
- Email: Required, valid email format
- Phone: Optional, max 20 characters
- License Number: Required, max 50 characters

### Rental Form

- Car: Required (only available cars shown)
- Customer: Required
- Start Date: Required
- End Date: Required, must be >= start date
- Status: ACTIVE | COMPLETED | CANCELLED
- Cost automatically calculated based on dates and car daily rate

## Error Handling

- API errors displayed via Snackbar alerts
- Form validation errors shown inline with helper text
- Confirmation dialogs for delete operations
- Loading spinners during async operations

## TypeScript

- Strict mode enabled
- No `any` types allowed
- All types defined in `src/types/index.ts`
- Full type safety for API responses
