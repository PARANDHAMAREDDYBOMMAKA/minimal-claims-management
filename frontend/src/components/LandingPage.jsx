import React from "react";
import { Box, Button, Typography, Container, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InsuranceIcon from "@mui/icons-material/AccountBalance";

function LandingPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 10,
          backgroundImage: "linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                Simple Claims Management Platform
              </Typography>
              <Typography variant="h6" paragraph>
                A streamlined solution for managing healthcare claims between
                patients and insurers.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{ mr: 2, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={Link}
                  to="/login"
                  sx={{ mb: 2 }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src="/api/placeholder/600/400"
                alt="Healthcare claims illustration"
                sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <HealthAndSafetyIcon
                  color="primary"
                  sx={{ fontSize: 60, mb: 2 }}
                />
                <Typography variant="h6" component="h3" gutterBottom>
                  For Patients
                </Typography>
                <Typography>
                  Submit claims easily with our simple form. Track your claim
                  status and receive updates when approved.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <InsuranceIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" component="h3" gutterBottom>
                  For Insurers
                </Typography>
                <Typography>
                  Efficiently review and manage claims. Filter by status to
                  prioritize your workflow.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <VerifiedUserIcon
                  color="primary"
                  sx={{ fontSize: 60, mb: 2 }}
                />
                <Typography variant="h6" component="h3" gutterBottom>
                  Secure & Simple
                </Typography>
                <Typography>
                  Our platform prioritizes security while maintaining a
                  user-friendly experience for all parties.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: "grey.100", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5">1</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  Create an Account
                </Typography>
                <Typography>
                  Sign up as a patient or insurer to access your dedicated
                  portal.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5">2</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  Submit or Review Claims
                </Typography>
                <Typography>
                  Patients submit claims with supporting documents. Insurers
                  review and process claims.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5">3</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  Track and Update
                </Typography>
                <Typography>
                  Both parties can track claim status through their dashboards.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Streamline Your Claims Process?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Join our platform today and experience a simplified approach to
          healthcare claims management.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/register"
        >
          Get Started Now
        </Button>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "primary.dark", color: "white", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Claims Management Platform
              </Typography>
              <Typography variant="body2">
                A simplified solution for healthcare claims processing.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                alignItems: "center",
              }}
            >
              <Typography variant="body2">
                © {new Date().getFullYear()} Claims Management. All rights
                reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
