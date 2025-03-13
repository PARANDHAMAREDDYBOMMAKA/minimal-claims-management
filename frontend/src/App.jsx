import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import AuthPage from "./components/AuthPage";
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
  CssBaseline,
  useScrollTrigger,
} from "@mui/material";
import { AccountCircle, Dashboard } from "@mui/icons-material";

// Function to handle elevation scroll effect for the AppBar
function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  return React.cloneElement(children, {
    sx: {
      transition: "all 0.3s ease",
      backdropFilter: "blur(12px)",
      backgroundColor: trigger ? "rgba(255, 255, 255, 0.2)" : "transparent",
      padding: trigger ? "8px 0" : "16px 0",
      boxShadow: trigger ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "none",
    },
  });
}

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const open = Boolean(anchorEl);

  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    handleMenuClose();
  };

  // Function to handle menu open
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <CssBaseline />
      <ElevationScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            borderRadius: "12px",
            margin: "10px auto",
            maxWidth: "95%",
            transition: "all 0.3s ease-in-out",
            backdropFilter: "blur(12px)",
            backgroundColor: isHovered
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: isHovered ? "0px 4px 20px rgba(0, 0, 0, 0.15)" : "none",
            "&:hover": {
              backdropFilter: "blur(18px)",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Container maxWidth="lg">
            <Toolbar>
              {/* Logo & Title */}
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                <Link
                  to={user ? "/dashboard" : "/"}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Dashboard sx={{ mr: 1 }} />
                  Claims Management
                </Link>
              </Typography>

              {/* Login & Signup buttons only when not logged in */}
              {!user && (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{ mr: 1, fontWeight: "bold" }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
                      color: "#000",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
                      },
                    }}
                    component={Link}
                    to="/register"
                  >
                    Sign Up
                  </Button>
                </>
              )}

              {/* Always show nav buttons when logged in */}
              {user && (
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
                      to="/submit-claim"
                      sx={{ mr: 2 }}
                    >
                      Submit Claim
                    </Button>
                  )}

                  {/* Profile Avatar & Dropdown */}
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    onClick={handleMenu}
                  >
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      {user.email.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" fontWeight="bold">
                        {user.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem disabled>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {user.role}
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ fontWeight: "bold" }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          pt: "80px",
          minHeight: "100vh",
          // Only apply dark background to landing page
          ...(isLandingPage && { backgroundColor: "#1A1A1A", color: "#fff" }),
        }}
      >
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={<AuthPage setUser={setUser} setToken={setToken} />}
              />
              <Route
                path="/register"
                element={<AuthPage setUser={setUser} setToken={setToken} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : user.role === "patient" ? (
            <>
              <Route
                path="/dashboard"
                element={<PatientDashboard token={token} user={user} />}
              />
              <Route
                path="/submit-claim"
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
    </>
  );
}

export default App;
