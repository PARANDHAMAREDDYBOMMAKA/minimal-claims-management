import React from "react";
import { Box, Button, Typography, Container, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import FAQ from "./FAQ";
import Footer from "./Footer";

const MotionPaper = motion(Paper);

const features = [
  {
    icon: (
      <HealthAndSafetyIcon sx={{ fontSize: 60, mb: 2, color: "#4CAF50" }} />
    ),
    title: "For Patients",
    description: "Easily submit claims and track approvals in real-time.",
  },
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 60, mb: 2, color: "#FFC107" }} />,
    title: "For Insurers",
    description: "Manage and process claims efficiently with advanced filters.",
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 60, mb: 2, color: "#03A9F4" }} />,
    title: "Secure & Simple",
    description: "Enjoy a seamless, secure experience for all claim processes.",
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 60, mb: 2, color: "#FF5722" }} />,
    title: "Fast Processing",
    description: "Get your claims processed in record time with our AI engine.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 60, mb: 2, color: "#9C27B0" }} />,
    title: "Encrypted Data",
    description: "Your personal and medical data is securely encrypted.",
  },
];

function LandingPage() {
  return (
    <Box sx={{ backgroundColor: "#1A1A1A", minHeight: "100vh", color: "#fff" }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(30,30,30,0.9) 30%, rgba(45,45,45,0.95) 90%)",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          borderBottomLeftRadius: "50px",
          borderBottomRightRadius: "50px",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Streamlined Claims Management
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              Simplifying healthcare claims for patients and insurers.
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  mr: 2,
                  background:
                    "linear-gradient(135deg, #4CAF50 30%, #81C784 90%)",
                  color: "#fff",
                  "&:hover": { background: "#388E3C" },
                }}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/login"
                sx={{
                  color: "#fff",
                  borderColor: "#81C784",
                  "&:hover": { backgroundColor: "#388E3C" },
                }}
              >
                Login
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#81C784" }}
        >
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionPaper
                elevation={4}
                sx={{
                  p: 4,
                  height: "100%",
                  textAlign: "center",
                  backdropFilter: "blur(15px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 3,
                  boxShadow: "0 8px 20px rgba(0, 255, 136, 0.2)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 30px rgba(0, 255, 136, 0.4)",
                  },
                }}
                whileHover={{ scale: 1.05 }}
              >
                {feature.icon}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  className="text-white"
                >
                  {feature.title}
                </Typography>
                <Typography sx={{ opacity: 0.8 }} className="text-white">
                  {feature.description}
                </Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box id="faq-section" sx={{ py: 8 }}>
        <FAQ />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default LandingPage;
