import { describe, it, expect } from "vitest";
import { rentalsApi } from "../api/rentals";
import type { Rental } from "../types";

describe("Rentals API", () => {
  it("fetches all rentals", async () => {
    const rentals = await rentalsApi.getAll();
    expect(rentals).toBeDefined();
    expect(Array.isArray(rentals)).toBe(true);
    expect(rentals.length).toBeGreaterThan(0);
  });

  it("fetches a rental by id", async () => {
    const rental = await rentalsApi.getById(1);
    expect(rental).toBeDefined();
    expect(rental.id).toBe(1);
    expect(rental.carId).toBe(1);
    expect(rental.customerId).toBe(1);
  });

  it("creates a new rental", async () => {
    const newRental: Omit<Rental, "id"> = {
      carId: 1,
      customerId: 1,
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      status: "ACTIVE",
      totalCost: 159.96,
    };

    const created = await rentalsApi.create(newRental);
    expect(created).toBeDefined();
    expect(created.carId).toBe(1);
    expect(created.customerId).toBe(1);
    expect(created.id).toBeDefined();
  });

  it("updates an existing rental", async () => {
    const updates: Omit<Rental, "id"> = {
      carId: 1,
      customerId: 1,
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      status: "COMPLETED",
      totalCost: 199.95,
    };

    const updated = await rentalsApi.update(1, updates);
    expect(updated).toBeDefined();
    expect(updated.status).toBe("COMPLETED");
  });

  it("deletes a rental", async () => {
    await expect(rentalsApi.delete(1)).resolves.not.toThrow();
  });

  it("throws error for non-existent rental", async () => {
    await expect(rentalsApi.getById(999)).rejects.toThrow();
  });
});
