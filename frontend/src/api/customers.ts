import type { Customer, CustomerCreate, CustomerUpdate } from "../types";

const API_BASE_URL = "http://localhost:8000";

export const customersApi = {
  async getAll(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/api/customers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }
    return response.json();
  },

  async getById(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.statusText}`);
    }
    return response.json();
  },

  async create(data: CustomerCreate): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
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
      throw new Error(error.detail || "Failed to create customer");
    }
    return response.json();
  },

  async update(id: number, data: CustomerUpdate): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
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
      throw new Error(error.detail || "Failed to update customer");
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || "Failed to delete customer");
    }
  },
};
