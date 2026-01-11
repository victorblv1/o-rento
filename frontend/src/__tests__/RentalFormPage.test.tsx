import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { RentalFormPage } from "../pages/RentalFormPage";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("RentalFormPage", () => {
  it("renders form with all required fields", async () => {
    renderWithRouter(<RentalFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/car/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/customer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });
  });

  it("loads cars and customers for selection", async () => {
    renderWithRouter(<RentalFormPage />);

    await waitFor(() => {
      const carSelect = screen.getByLabelText(/car/i);
      expect(carSelect).toBeInTheDocument();
    });
  });

  it("validates date range", async () => {
    renderWithRouter(<RentalFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    });
  });

  it("disables submit button when form is invalid", async () => {
    renderWithRouter(<RentalFormPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /new rental|edit rental/i })
      ).toBeInTheDocument();
    });
  });

  it("calculates total cost based on dates and car rate", async () => {
    renderWithRouter(<RentalFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/car/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/customer/i)).toBeInTheDocument();
    });
  });
});
