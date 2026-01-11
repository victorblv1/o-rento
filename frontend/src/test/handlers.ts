import { http, HttpResponse } from "msw";
import type { Car, Customer, Rental } from "../types";

const BASE_URL = "http://localhost:8000/api";

// Mock data
const mockCars: Car[] = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    imageUrl: "https://example.com/car1.jpg",
    status: "AVAILABLE",
    dailyRate: 39.99,
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2023,
    imageUrl: "https://example.com/car2.jpg",
    status: "RENTED",
    dailyRate: 45.0,
  },
];

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "123-456-7890",
    licenseNumber: "DL123456",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "098-765-4321",
    licenseNumber: "DL789012",
  },
];

const mockRentals: Rental[] = [
  {
    id: 1,
    carId: 1,
    customerId: 1,
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    status: "ACTIVE",
    totalCost: 199.95,
  },
];

export const handlers = [
  // Cars
  http.get(`${BASE_URL}/cars`, () => {
    return HttpResponse.json(mockCars);
  }),
  http.get(`${BASE_URL}/cars/:id`, ({ params }) => {
    const car = mockCars.find((c) => c.id === Number(params.id));
    if (!car) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(car);
  }),
  http.post(`${BASE_URL}/cars`, async ({ request }) => {
    const body = (await request.json()) as Omit<Car, "id">;
    const newCar = { ...body, id: mockCars.length + 1 };
    mockCars.push(newCar);
    return HttpResponse.json(newCar, { status: 201 });
  }),
  http.put(`${BASE_URL}/cars/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Omit<Car, "id">;
    const index = mockCars.findIndex((c) => c.id === Number(params.id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockCars[index] = { ...body, id: Number(params.id) };
    return HttpResponse.json(mockCars[index]);
  }),
  http.delete(`${BASE_URL}/cars/:id`, ({ params }) => {
    const index = mockCars.findIndex((c) => c.id === Number(params.id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockCars.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Customers
  http.get(`${BASE_URL}/customers`, () => {
    return HttpResponse.json(mockCustomers);
  }),
  http.get(`${BASE_URL}/customers/:id`, ({ params }) => {
    const customer = mockCustomers.find((c) => c.id === Number(params.id));
    if (!customer) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(customer);
  }),
  http.post(`${BASE_URL}/customers`, async ({ request }) => {
    const body = (await request.json()) as Omit<Customer, "id">;
    const newCustomer = { ...body, id: mockCustomers.length + 1 };
    mockCustomers.push(newCustomer);
    return HttpResponse.json(newCustomer, { status: 201 });
  }),
  http.put(`${BASE_URL}/customers/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Omit<Customer, "id">;
    const index = mockCustomers.findIndex((c) => c.id === Number(params.id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockCustomers[index] = { ...body, id: Number(params.id) };
    return HttpResponse.json(mockCustomers[index]);
  }),
  http.delete(`${BASE_URL}/customers/:id`, ({ params }) => {
    const index = mockCustomers.findIndex((c) => c.id === Number(params.id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockCustomers.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Rentals
  http.get(`${BASE_URL}/rentals`, () => {
    return HttpResponse.json(mockRentals);
  }),
  http.get(`${BASE_URL}/rentals/:id`, ({ params }) => {
    const rental = mockRentals.find((r) => r.id === Number(params.id));
    if (!rental) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(rental);
  }),
  http.post(`${BASE_URL}/rentals`, async ({ request }) => {
    const body = (await request.json()) as Omit<Rental, "id">;
    const newRental = { ...body, id: mockRentals.length + 1 };
    mockRentals.push(newRental);
    return HttpResponse.json(newRental, { status: 201 });
  }),
  http.put(`${BASE_URL}/rentals/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Omit<Rental, "id">;
    const index = mockRentals.findIndex((r) => r.id === Number(params.id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockRentals[index] = { ...body, id: Number(params.id) };
    return HttpResponse.json(mockRentals[index]);
  }),
  http.delete(`${BASE_URL}/rentals/:id`, ({ params }) => {
    const index = mockRentals.findIndex((r) => r.id === Number(params.id));
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockRentals.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
