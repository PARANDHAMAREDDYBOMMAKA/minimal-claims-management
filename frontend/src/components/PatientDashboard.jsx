import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Paper,
  TableContainer,
  Chip,
  Container,
  Grid,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/api";
import { toast } from "react-toastify";
import {
  MonetizationOn,
  Event,
  AssignmentTurnedIn,
  Dashboard as DashboardIcon,
  LocalHospital,
  Add,
} from "@mui/icons-material";
import { motion } from "framer-motion";

function PatientDashboard() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedAmount: 0,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Fetch claims data on component mount
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get("/claims");
        if (res.data && Array.isArray(res.data.claims)) {
          setClaims(res.data.claims);

          // Calculate stats
          const approved = res.data.claims.filter(
            (claim) => claim.status === "Approved"
          );
          setStats({
            totalClaims: res.data.claims.length,
            pendingClaims: res.data.claims.filter(
              (claim) => claim.status === "Pending"
            ).length,
            approvedAmount: approved.reduce(
              (sum, claim) => sum + (claim.approvedAmount || 0),
              0
            ),
          });
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (error) {
        toast.error("Failed to fetch claims. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            textAlign: "center",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h5" color="error" gutterBottom>
              Unauthorized! Please log in.
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              startIcon={<DashboardIcon />}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Function to get status chip with appropriate color and icon
  const getStatusChip = (status) => {
    const statusMap = {
      Pending: { color: "warning", icon: <Event /> },
      Approved: { color: "success", icon: <AssignmentTurnedIn /> },
      Rejected: { color: "error", icon: <MonetizationOn /> },
      "In Review": { color: "info", icon: <Event /> },
    };

    const chipInfo = statusMap[status] || { color: "default", icon: null };

    return (
      <Chip
        icon={chipInfo.icon}
        label={status}
        color={chipInfo.color}
        size="small"
        sx={{
          fontWeight: "bold",
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.2s ease-in-out",
          },
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 3,
        pt: 4,
      }}
    >
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <LocalHospital color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                color="primary"
              >
                Patient Dashboard
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 2,
                p: 3,
                mb: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Welcome, {user?.name} 👋
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Here's an overview of your health insurance claims
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Card
                    sx={{
                      bgcolor: "#e3f2fd",
                      height: "100%",
                      transition:
                        "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="text.secondary">
                        Total Claims
                      </Typography>
                      <Typography variant="h3" color="primary">
                        {stats.totalClaims}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card
                    sx={{
                      bgcolor: "#fff8e1",
                      height: "100%",
                      transition:
                        "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="text.secondary">
                        Pending Claims
                      </Typography>
                      <Typography variant="h3" color="warning.main">
                        {stats.pendingClaims}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card
                    sx={{
                      bgcolor: "#e8f5e9",
                      height: "100%",
                      transition:
                        "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="text.secondary">
                        Total Approved
                      </Typography>
                      <Typography variant="h3" color="success.main">
                        ₹{stats.approvedAmount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/submit-claim"
                variant="contained"
                color="primary"
                startIcon={<Add />}
                sx={{
                  borderRadius: "24px",
                  px: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                Submit New Claim
              </Button>
            </motion.div>
          </Box>

          <motion.div variants={itemVariants}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : claims.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary">
                    No claims found.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Get started by submitting your first claim.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>
                          <Typography variant="subtitle2">Name</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            Claim Amount
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">Status</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            Submission Date
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            Approved Amount
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {claims.map((claim, index) => (
                        <TableRow
                          key={claim._id}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "rgba(0, 0, 0, 0.02)",
                            },
                            transition: "background-color 0.2s ease-in-out",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell>{claim.name}</TableCell>
                          <TableCell>₹{claim.claimAmount}</TableCell>
                          <TableCell>{getStatusChip(claim.status)}</TableCell>
                          <TableCell>
                            {new Date(
                              claim.submissionDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {claim.approvedAmount
                              ? `₹${claim.approvedAmount}`
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}

export default PatientDashboard;
