import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import type { RentalCreate, RentalStatus, Car, Customer } from "../types";
import { rentalsApi } from "../api/rentals";
import { carsApi } from "../api/cars";
import { customersApi } from "../api/customers";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";

export function RentalFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<RentalCreate>({
    carId: 0,
    customerId: 0,
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [carsData, customersData] = await Promise.all([
        carsApi.getAll(),
        customersApi.getAll(),
      ]);
      setCars(carsData);
      setCustomers(customersData);

      if (isEditMode) {
        const rental = await rentalsApi.getById(Number(id));
        setFormData({
          carId: rental.carId,
          customerId: rental.customerId,
          startDate: rental.startDate,
          endDate: rental.endDate,
          status: rental.status,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.carId) {
      newErrors.carId = "Car is required";
    }

    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after or equal to start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode) {
        await rentalsApi.update(Number(id), formData);
      } else {
        await rentalsApi.create(formData);
      }
      navigate("/rentals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rental");
    }
  };

  const handleChange = (field: keyof RentalCreate, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const calculateCostEstimate = () => {
    if (!formData.carId || !formData.startDate || !formData.endDate) {
      return null;
    }

    const car = cars.find((c) => c.id === formData.carId);
    if (!car) return null;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
    const cost = days * car.dailyRate;

    return { days, cost };
  };

  if (loading) return <LoadingSpinner />;

  const isFormValid =
    formData.carId > 0 &&
    formData.customerId > 0 &&
    formData.startDate !== "" &&
    formData.endDate !== "" &&
    Object.keys(errors).length === 0;

  const costEstimate = calculateCostEstimate();
  const availableCars = cars.filter(
    (car) => car.status === "AVAILABLE" || car.id === formData.carId
  );

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? "Edit Rental" : "New Rental"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            select
            label="Car"
            value={formData.carId || ""}
            onChange={(e) => handleChange("carId", Number(e.target.value))}
            error={!!errors.carId}
            helperText={errors.carId || "Select an available car"}
            margin="normal"
            required
          >
            <MenuItem value="">
              <em>Select a car</em>
            </MenuItem>
            {availableCars.map((car) => (
              <MenuItem key={car.id} value={car.id}>
                {car.make} {car.model} ({car.year}) - ${car.dailyRate}/day
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Customer"
            value={formData.customerId || ""}
            onChange={(e) => handleChange("customerId", Number(e.target.value))}
            error={!!errors.customerId}
            helperText={errors.customerId}
            margin="normal"
            required
          >
            <MenuItem value="">
              <em>Select a customer</em>
            </MenuItem>
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            error={!!errors.startDate}
            helperText={errors.startDate}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            error={!!errors.endDate}
            helperText={errors.endDate}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as RentalStatus)
            }
            margin="normal"
            required
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>

          {costEstimate && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Duration: {costEstimate.days} day
              {costEstimate.days !== 1 ? "s" : ""} • Estimated cost: $
              {costEstimate.cost.toFixed(2)}
            </Alert>
          )}

          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              type="submit"
              disabled={!isFormValid}
              fullWidth
            >
              {isEditMode ? "Update" : "Create"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/rentals")}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>

      <ErrorAlert error={error} onClose={() => setError(null)} />
    </Container>
  );
}
