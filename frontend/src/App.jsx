import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientDashboard from "./components/PatientDashboard";
import PatientClaimForm from "./components/PatientClaimForm";
import InsurerDashboard from "./components/InsurerDashboard";
import ClaimReviewPanel from "./components/ClaimReviewPanel";
import LandingPage from "./components/LandingPage";
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { AccountCircle, Dashboard } from "@mui/icons-material";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    handleMenuClose();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar position="static" elevation={1}>
          <Container maxWidth="lg">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                <Link
                  to={user ? "/dashboard" : "/"}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Dashboard sx={{ mr: 1 }} />
                  Claims Management
                </Link>
              </Typography>

              {user ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/dashboard"
                    sx={{ mr: 2 }}
                  >
                    Dashboard
                  </Button>
                  {user.role === "patient" && (
                    <Button
                      color="inherit"
                      component={Link}
                      to="/submit"
                      sx={{ mr: 2 }}
                    >
                      Submit Claim
                    </Button>
                  )}
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="account"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                    >
                      {user.email.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={open}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" color="textSecondary">
                        Signed in as
                      </Typography>
                    </MenuItem>
                    <MenuItem disabled>
                      <Typography variant="body2">{user.email}</Typography>
                    </MenuItem>
                    <MenuItem disabled>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {user.role}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/register"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>

        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            {!user ? (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/login"
                  element={<Login setUser={setUser} setToken={setToken} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : user.role === "patient" ? (
              <>
                <Route
                  path="/dashboard"
                  element={<PatientDashboard token={token} user={user} />}
                />
                <Route
                  path="/submit"
                  element={<PatientClaimForm token={token} user={user} />}
                />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route
                  path="/dashboard"
                  element={<InsurerDashboard token={token} user={user} />}
                />
                <Route
                  path="/review/:id"
                  element={<ClaimReviewPanel token={token} user={user} />}
                />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
