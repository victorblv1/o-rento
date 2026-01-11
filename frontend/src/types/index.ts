/**
 * TypeScript type definitions for O-Rento
 */

export type CarStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";
export type RentalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  imageUrl: string;
  status: CarStatus;
  dailyRate: number;
}

export interface CarCreate {
  make: string;
  model: string;
  year: number;
  imageUrl: string;
  status: CarStatus;
  dailyRate: number;
}

export interface CarUpdate {
  make?: string;
  model?: string;
  year?: number;
  imageUrl?: string;
  status?: CarStatus;
  dailyRate?: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  licenseNumber: string;
}

export interface CustomerCreate {
  name: string;
  email: string;
  phone?: string;
  licenseNumber: string;
}

export interface CustomerUpdate {
  name?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
}

export interface Rental {
  id: number;
  carId: number;
  customerId: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: RentalStatus;
  totalCost: number;
}

export interface RentalCreate {
  carId: number;
  customerId: number;
  startDate: string;
  endDate: string;
  status: RentalStatus;
}

export interface RentalUpdate {
  carId?: number;
  customerId?: number;
  startDate?: string;
  endDate?: string;
  status?: RentalStatus;
}
