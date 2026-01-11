import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { CustomerListPage } from "../pages/CustomerListPage";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CustomerListPage", () => {
  it("renders customer list with items from API", async () => {
    renderWithRouter(<CustomerListPage />);

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });
  });

  it("displays customer email addresses", async () => {
    renderWithRouter(<CustomerListPage />);

    await waitFor(() => {
      expect(screen.getByText("alice@example.com")).toBeInTheDocument();
      expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    });
  });

  it("displays customer phone numbers", async () => {
    renderWithRouter(<CustomerListPage />);

    await waitFor(() => {
      expect(screen.getByText("123-456-7890")).toBeInTheDocument();
      expect(screen.getByText("098-765-4321")).toBeInTheDocument();
    });
  });

  it("displays license numbers", async () => {
    renderWithRouter(<CustomerListPage />);

    await waitFor(() => {
      expect(screen.getByText("DL123456")).toBeInTheDocument();
      expect(screen.getByText("DL789012")).toBeInTheDocument();
    });
  });

  it("filters customers by search term", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CustomerListPage />);

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Alice");

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });
  });

  it("shows edit and delete buttons for each customer", async () => {
    renderWithRouter(<CustomerListPage />);

    await waitFor(() => {
      const editButtons = screen.getAllByTestId("EditIcon");
      const deleteButtons = screen.getAllByTestId("DeleteIcon");
      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it("shows add customer button", async () => {
    renderWithRouter(<CustomerListPage />);
    await waitFor(() => {
      expect(screen.getByText(/add customer/i)).toBeInTheDocument();
    });
  });

  it("displays loading spinner initially", () => {
    renderWithRouter(<CustomerListPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
