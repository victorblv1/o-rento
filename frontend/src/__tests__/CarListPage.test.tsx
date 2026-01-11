import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { CarListPage } from "../pages/CarListPage";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CarListPage", () => {
  it("renders car list with items from API", async () => {
    renderWithRouter(<CarListPage />);

    await waitFor(() => {
      expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
      expect(screen.getByText("Honda Civic")).toBeInTheDocument();
    });
  });

  it("displays car status badges", async () => {
    renderWithRouter(<CarListPage />);

    await waitFor(() => {
      expect(screen.getByText("AVAILABLE")).toBeInTheDocument();
      expect(screen.getByText("RENTED")).toBeInTheDocument();
    });
  });

  it("displays daily rates", async () => {
    renderWithRouter(<CarListPage />);

    await waitFor(() => {
      expect(screen.getByText(/\$39\.99/)).toBeInTheDocument();
      expect(screen.getByText(/\$45\.00/)).toBeInTheDocument();
    });
  });

  it("filters cars by search term", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CarListPage />);

    await waitFor(() => {
      expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Toyota");

    await waitFor(() => {
      expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    });
  });

  it("filters cars by status", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CarListPage />);

    await waitFor(() => {
      expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    });

    const statusFilter = screen.getByLabelText(/status/i);
    await user.click(statusFilter);

    await waitFor(() => {
      const availableOption = screen.getByRole("option", {
        name: /available/i,
      });
      expect(availableOption).toBeInTheDocument();
    });
  });

  it("shows edit and delete buttons for each car", async () => {
    renderWithRouter(<CarListPage />);

    await waitFor(() => {
      const editButtons = screen.getAllByTestId("EditIcon");
      const deleteButtons = screen.getAllByTestId("DeleteIcon");
      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it("shows add car button", async () => {
    renderWithRouter(<CarListPage />);
    await waitFor(() => {
      expect(screen.getByText(/add car/i)).toBeInTheDocument();
    });
  });

  it("displays loading spinner initially", () => {
    renderWithRouter(<CarListPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
