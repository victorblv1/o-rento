import { describe, it, expect } from "vitest";
import { customersApi } from "../api/customers";
import type { Customer } from "../types";

describe("Customers API", () => {
  it("fetches all customers", async () => {
    const customers = await customersApi.getAll();
    expect(customers).toBeDefined();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBeGreaterThan(0);
  });

  it("fetches a customer by id", async () => {
    const customer = await customersApi.getById(1);
    expect(customer).toBeDefined();
    expect(customer.id).toBe(1);
    expect(customer.name).toBe("Alice Johnson");
    expect(customer.email).toBe("alice@example.com");
  });

  it("creates a new customer", async () => {
    const newCustomer: Omit<Customer, "id"> = {
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "555-1234",
      licenseNumber: "DL999888",
    };

    const created = await customersApi.create(newCustomer);
    expect(created).toBeDefined();
    expect(created.name).toBe("Charlie Brown");
    expect(created.email).toBe("charlie@example.com");
    expect(created.id).toBeDefined();
  });

  it("updates an existing customer", async () => {
    const updates: Omit<Customer, "id"> = {
      name: "Alice Johnson Updated",
      email: "alice@example.com",
      phone: "555-9999",
      licenseNumber: "DL123456",
    };

    const updated = await customersApi.update(1, updates);
    expect(updated).toBeDefined();
    expect(updated.name).toBe("Alice Johnson Updated");
    expect(updated.phone).toBe("555-9999");
  });

  it("deletes a customer", async () => {
    await expect(customersApi.delete(1)).resolves.not.toThrow();
  });

  it("throws error for non-existent customer", async () => {
    await expect(customersApi.getById(999)).rejects.toThrow();
  });
});
