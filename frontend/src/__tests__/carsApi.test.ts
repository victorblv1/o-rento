import { describe, it, expect, beforeEach } from "vitest";
import { carsApi } from "../api/cars";
import type { Car } from "../types";

describe("Cars API", () => {
  beforeEach(() => {
    // Reset any state between tests if needed
  });

  it("fetches all cars", async () => {
    const cars = await carsApi.getAll();
    expect(cars).toBeDefined();
    expect(Array.isArray(cars)).toBe(true);
    expect(cars.length).toBeGreaterThan(0);
  });

  it("fetches a car by id", async () => {
    const car = await carsApi.getById(1);
    expect(car).toBeDefined();
    expect(car.id).toBe(1);
    expect(car.make).toBe("Toyota");
    expect(car.model).toBe("Corolla");
  });

  it("creates a new car", async () => {
    const newCar: Omit<Car, "id"> = {
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      imageUrl: "https://example.com/tesla.jpg",
      status: "AVAILABLE",
      dailyRate: 79.99,
    };

    const created = await carsApi.create(newCar);
    expect(created).toBeDefined();
    expect(created.make).toBe("Tesla");
    expect(created.model).toBe("Model 3");
    expect(created.id).toBeDefined();
  });

  it("updates an existing car", async () => {
    const updates: Omit<Car, "id"> = {
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      imageUrl: "https://example.com/car1.jpg",
      status: "MAINTENANCE",
      dailyRate: 42.99,
    };

    const updated = await carsApi.update(1, updates);
    expect(updated).toBeDefined();
    expect(updated.status).toBe("MAINTENANCE");
    expect(updated.dailyRate).toBe(42.99);
  });

  it("deletes a car", async () => {
    await expect(carsApi.delete(1)).resolves.not.toThrow();
  });

  it("throws error for non-existent car", async () => {
    await expect(carsApi.getById(999)).rejects.toThrow();
  });
});
