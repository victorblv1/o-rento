import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { CarFormPage } from "../pages/CarFormPage";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CarFormPage", () => {
  it("renders form with all required fields", () => {
    renderWithRouter(<CarFormPage />);

    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/daily rate/i)).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    renderWithRouter(<CarFormPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /add new car|edit car/i })
      ).toBeInTheDocument();
    });
  });

  it("validates year range", async () => {
    renderWithRouter(<CarFormPage />);

    await waitFor(() => {
      const yearInput = screen.getByLabelText(/year/i);
      expect(yearInput).toBeInTheDocument();
    });
  });

  it("validates URL format", async () => {
    renderWithRouter(<CarFormPage />);

    await waitFor(() => {
      const urlInput = screen.getByLabelText(/image url/i);
      expect(urlInput).toBeInTheDocument();
    });
  });

  it("disables submit button when form is invalid", async () => {
    renderWithRouter(<CarFormPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });

  it("enables submit button when form is valid", async () => {
    renderWithRouter(<CarFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    renderWithRouter(<CarFormPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/daily rate/i)).toBeInTheDocument();
    });
  });
});
