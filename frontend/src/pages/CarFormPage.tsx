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
} from "@mui/material";
import type { CarCreate, CarStatus } from "../types";
import { carsApi } from "../api/cars";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";

export function CarFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CarCreate>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    imageUrl: "",
    status: "AVAILABLE",
    dailyRate: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      loadCar();
    }
  }, [id]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const car = await carsApi.getById(Number(id));
      setFormData({
        make: car.make,
        model: car.model,
        year: car.year,
        imageUrl: car.imageUrl,
        status: car.status,
        dailyRate: car.dailyRate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load car");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.make.trim()) {
      newErrors.make = "Make is required";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }

    const currentYear = new Date().getFullYear();
    if (formData.year < 1900 || formData.year > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = "Invalid URL format";
      }
    }

    if (formData.dailyRate < 0) {
      newErrors.dailyRate = "Daily rate must be 0 or greater";
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
        await carsApi.update(Number(id), formData);
      } else {
        await carsApi.create(formData);
      }
      navigate("/cars");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save car");
    }
  };

  const handleChange = (field: keyof CarCreate, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (loading) return <LoadingSpinner />;

  const isFormValid =
    formData.make.trim() !== "" &&
    formData.model.trim() !== "" &&
    formData.imageUrl.trim() !== "" &&
    formData.dailyRate >= 0 &&
    Object.keys(errors).length === 0;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? "Edit Car" : "Add New Car"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Make"
            value={formData.make}
            onChange={(e) => handleChange("make", e.target.value)}
            error={!!errors.make}
            helperText={errors.make}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Model"
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            error={!!errors.model}
            helperText={errors.model}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Year"
            type="number"
            value={formData.year}
            onChange={(e) =>
              handleChange(
                "year",
                parseInt(e.target.value) || new Date().getFullYear()
              )
            }
            error={!!errors.year}
            helperText={
              errors.year || `Between 1900 and ${new Date().getFullYear() + 1}`
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl || "Enter a valid image URL"}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as CarStatus)
            }
            margin="normal"
            required
          >
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="RENTED">Rented</MenuItem>
            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Daily Rate"
            type="number"
            value={formData.dailyRate}
            onChange={(e) =>
              handleChange("dailyRate", parseFloat(e.target.value) || 0)
            }
            error={!!errors.dailyRate}
            helperText={errors.dailyRate || "Daily rental rate in dollars"}
            margin="normal"
            required
            inputProps={{ step: 0.01, min: 0 }}
          />

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
              onClick={() => navigate("/cars")}
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
