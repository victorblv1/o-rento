import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { RentalListPage } from "../pages/RentalListPage";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("RentalListPage", () => {
  it("renders rental list with items from API", async () => {
    renderWithRouter(<RentalListPage />);

    await waitFor(() => {
      // Check for rental data (dates are displayed as M/D/YYYY format)
      expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/1\/20\/2024/)).toBeInTheDocument();
    });
  });

  it("displays rental status badges", async () => {
    renderWithRouter(<RentalListPage />);

    await waitFor(() => {
      expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    });
  });

  it("displays total cost", async () => {
    renderWithRouter(<RentalListPage />);

    await waitFor(() => {
      expect(screen.getByText(/\$199\.95/)).toBeInTheDocument();
    });
  });

  it("calculates duration in days", async () => {
    renderWithRouter(<RentalListPage />);

    await waitFor(() => {
      expect(screen.getByText(/5 days/)).toBeInTheDocument();
    });
  });

  it("filters rentals by status", async () => {
    const user = userEvent.setup();
    renderWithRouter(<RentalListPage />);

    await waitFor(() => {
      expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    });

    const statusFilter = screen.getByLabelText(/status/i);
    await user.click(statusFilter);

    await waitFor(() => {
      const activeOption = screen.getByRole("option", { name: /^active$/i });
      expect(activeOption).toBeInTheDocument();
    });
  });

  it("shows edit and delete buttons for each rental", async () => {
    renderWithRouter(<RentalListPage />);

    await waitFor(() => {
      const editButtons = screen.getAllByTestId("EditIcon");
      const deleteButtons = screen.getAllByTestId("DeleteIcon");
      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it("shows add rental button", async () => {
    renderWithRouter(<RentalListPage />);
    await waitFor(() => {
      expect(screen.getByText(/add rental/i)).toBeInTheDocument();
    });
  });

  it("displays loading spinner initially", () => {
    renderWithRouter(<RentalListPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
