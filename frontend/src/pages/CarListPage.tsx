import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Chip,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Car, CarStatus } from "../types";
import { carsApi } from "../api/cars";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";
import { SuccessAlert } from "../components/SuccessAlert";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function CarListPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    car: Car | null;
  }>({
    open: false,
    car: null,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<CarStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, statusFilter, searchTerm]);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await carsApi.getAll();
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = [...cars];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((car) => car.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term)
      );
    }

    setFilteredCars(filtered);
  };

  const handleDelete = async () => {
    if (!deleteDialog.car) return;

    try {
      await carsApi.delete(deleteDialog.car.id);
      setSuccess(
        `Car ${deleteDialog.car.make} ${deleteDialog.car.model} deleted successfully`
      );
      setDeleteDialog({ open: false, car: null });
      loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete car");
      setDeleteDialog({ open: false, car: null });
    }
  };

  const getStatusColor = (status: CarStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "success";
      case "RENTED":
        return "error";
      case "MAINTENANCE":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Cars
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/cars/new")}
        >
          Add Car
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by make or model"
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CarStatus | "ALL")}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="RENTED">Rented</MenuItem>
          <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filteredCars.map((car) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={car.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x200?text=No+Image";
                }}
              />
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6" component="h2">
                    {car.make} {car.model}
                  </Typography>
                  <Chip
                    label={car.status}
                    color={getStatusColor(car.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Year: {car.year}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${car.dailyRate.toFixed(2)}/day
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/cars/edit/${car.id}`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeleteDialog({ open: true, car })}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCars.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No cars found
          </Typography>
        </Box>
      )}

      <ErrorAlert error={error} onClose={() => setError(null)} />
      <SuccessAlert message={success} onClose={() => setSuccess(null)} />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Car"
        message={`Are you sure you want to delete ${deleteDialog.car?.make} ${deleteDialog.car?.model}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, car: null })}
      />
    </Container>
  );
}
