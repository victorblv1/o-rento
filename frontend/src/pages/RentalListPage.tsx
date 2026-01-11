import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Rental, RentalStatus, Car, Customer } from "../types";
import { rentalsApi } from "../api/rentals";
import { carsApi } from "../api/cars";
import { customersApi } from "../api/customers";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";
import { SuccessAlert } from "../components/SuccessAlert";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function RentalListPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    rental: Rental | null;
  }>({
    open: false,
    rental: null,
  });
  const [statusFilter, setStatusFilter] = useState<RentalStatus | "ALL">("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRentals();
  }, [rentals, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rentalsData, carsData, customersData] = await Promise.all([
        rentalsApi.getAll(),
        carsApi.getAll(),
        customersApi.getAll(),
      ]);
      setRentals(rentalsData);
      setCars(carsData);
      setCustomers(customersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  const filterRentals = () => {
    if (statusFilter === "ALL") {
      setFilteredRentals(rentals);
    } else {
      setFilteredRentals(
        rentals.filter((rental) => rental.status === statusFilter)
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.rental) return;

    try {
      await rentalsApi.delete(deleteDialog.rental.id);
      setSuccess("Rental deleted successfully");
      setDeleteDialog({ open: false, rental: null });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete rental");
      setDeleteDialog({ open: false, rental: null });
    }
  };

  const getCarName = (carId: number) => {
    const car = cars.find((c) => c.id === carId);
    return car ? `${car.make} ${car.model}` : "Unknown";
  };

  const getCustomerName = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown";
  };

  const getStatusColor = (status: RentalStatus) => {
    switch (status) {
      case "ACTIVE":
        return "primary";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ py: 4, width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Rentals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/rentals/new")}
        >
          Add Rental
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as RentalStatus | "ALL")
          }
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Car</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{getCarName(rental.carId)}</TableCell>
                <TableCell>{getCustomerName(rental.customerId)}</TableCell>
                <TableCell>
                  {new Date(rental.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(rental.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {getDuration(rental.startDate, rental.endDate)} days
                </TableCell>
                <TableCell>${rental.totalCost.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={rental.status}
                    color={getStatusColor(rental.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/rentals/edit/${rental.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, rental })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredRentals.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No rentals found
          </Typography>
        </Box>
      )}

      <ErrorAlert error={error} onClose={() => setError(null)} />
      <SuccessAlert message={success} onClose={() => setSuccess(null)} />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Rental"
        message="Are you sure you want to delete this rental?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, rental: null })}
      />
    </Box>
  );
}
