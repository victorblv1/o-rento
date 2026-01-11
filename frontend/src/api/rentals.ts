import type { Rental, RentalCreate, RentalUpdate } from "../types";

const API_BASE_URL = "http://localhost:8000";

export const rentalsApi = {
  async getAll(): Promise<Rental[]> {
    const response = await fetch(`${API_BASE_URL}/api/rentals`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rentals: ${response.statusText}`);
    }
    return response.json();
  },

  async getById(id: number): Promise<Rental> {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rental: ${response.statusText}`);
    }
    return response.json();
  },

  async create(data: RentalCreate): Promise<Rental> {
    const response = await fetch(`${API_BASE_URL}/api/rentals`, {
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
      throw new Error(error.detail || "Failed to create rental");
    }
    return response.json();
  },

  async update(id: number, data: RentalUpdate): Promise<Rental> {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${id}`, {
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
      throw new Error(error.detail || "Failed to update rental");
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || "Failed to delete rental");
    }
  },
};
