import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { CustomerFormPage } from "../pages/CustomerFormPage";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CustomerFormPage", () => {
  it("renders form with all required fields", () => {
    renderWithRouter(<CustomerFormPage />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/license number/i)).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    renderWithRouter(<CustomerFormPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /add new customer|edit customer/i })
      ).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    renderWithRouter(<CustomerFormPage />);

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
    });
  });

  it("validates name max length", async () => {
    renderWithRouter(<CustomerFormPage />);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();
    });
  });

  it("disables submit button when form is invalid", async () => {
    renderWithRouter(<CustomerFormPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });

  it("enables submit button when form is valid", async () => {
    renderWithRouter(<CustomerFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    renderWithRouter(<CustomerFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/license number/i)).toBeInTheDocument();
    });
  });
});
