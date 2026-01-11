import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { DirectionsCar, People, Assignment } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          O-Rento
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Car Rental Management System
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <DirectionsCar
                sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h5" component="h2" gutterBottom>
                Cars
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Manage your vehicle fleet. Add, edit, and track car
                availability.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/cars")}>
                View Cars
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <People sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Customers
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Manage customer information and contact details.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/customers")}
              >
                View Customers
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Assignment sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Rentals
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Create and manage car rental agreements.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/rentals")}>
                View Rentals
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
