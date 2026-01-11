import type { Car, CarCreate, CarUpdate } from "../types";

const API_BASE_URL = "http://localhost:8000";

export const carsApi = {
  async getAll(): Promise<Car[]> {
    const response = await fetch(`${API_BASE_URL}/api/cars`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.statusText}`);
    }
    return response.json();
  },

  async getById(id: number): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/api/cars/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch car: ${response.statusText}`);
    }
    return response.json();
  },

  async create(data: CarCreate): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/api/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || "Failed to create car");
    }
    return response.json();
  },

  async update(id: number, data: CarUpdate): Promise<Car> {
    const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || "Failed to update car");
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || "Failed to delete car");
    }
  },
};
