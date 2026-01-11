import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { DirectionsCar, People, Assignment, Home } from "@mui/icons-material";

import { HomePage } from "./pages/HomePage";
import { CarListPage } from "./pages/CarListPage";
import { CarFormPage } from "./pages/CarFormPage";
import { CustomerListPage } from "./pages/CustomerListPage";
import { CustomerFormPage } from "./pages/CustomerFormPage";
import { RentalListPage } from "./pages/RentalListPage";
import { RentalFormPage } from "./pages/RentalFormPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              O-Rento
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<Home />}
              >
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/cars"
                startIcon={<DirectionsCar />}
              >
                Cars
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/customers"
                startIcon={<People />}
              >
                Customers
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/rentals"
                startIcon={<Assignment />}
              >
                Rentals
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} disableGutters>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cars" element={<CarListPage />} />
            <Route path="/cars/new" element={<CarFormPage />} />
            <Route path="/cars/edit/:id" element={<CarFormPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/edit/:id" element={<CustomerFormPage />} />
            <Route path="/rentals" element={<RentalListPage />} />
            <Route path="/rentals/new" element={<RentalFormPage />} />
            <Route path="/rentals/edit/:id" element={<RentalFormPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
