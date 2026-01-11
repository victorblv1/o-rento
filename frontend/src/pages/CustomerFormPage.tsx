import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import type { CustomerCreate } from "../types";
import { customersApi } from "../api/customers";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";

export function CustomerFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerCreate>({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const customer = await customersApi.getById(Number(id));
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        licenseNumber: customer.licenseNumber,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be 100 characters or less";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = "Phone must be 20 characters or less";
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    } else if (formData.licenseNumber.length > 50) {
      newErrors.licenseNumber = "License number must be 50 characters or less";
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
      const data = {
        ...formData,
        phone: formData.phone || undefined,
      };

      if (isEditMode) {
        await customersApi.update(Number(id), data);
      } else {
        await customersApi.create(data);
      }
      navigate("/customers");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    }
  };

  const handleChange = (field: keyof CustomerCreate, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (loading) return <LoadingSpinner />;

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.licenseNumber.trim() !== "" &&
    Object.keys(errors).length === 0;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? "Edit Customer" : "Add New Customer"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name || "Maximum 100 characters"}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone || "Optional, maximum 20 characters"}
            margin="normal"
          />

          <TextField
            fullWidth
            label="License Number"
            value={formData.licenseNumber}
            onChange={(e) => handleChange("licenseNumber", e.target.value)}
            error={!!errors.licenseNumber}
            helperText={errors.licenseNumber || "Maximum 50 characters"}
            margin="normal"
            required
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
              onClick={() => navigate("/customers")}
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
