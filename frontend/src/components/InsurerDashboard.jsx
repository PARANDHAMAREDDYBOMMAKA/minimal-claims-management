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
  TextField,
  MenuItem,
  TableContainer,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  IconButton,
  Badge,
  Avatar,
  Container,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../services/api";
import { toast } from "react-toastify";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";

function InsurerDashboard({ token }) {
  const [claims, setClaims] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
  });

  // Fetch claims data from the server
  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = response.data.claims || [];

      if (!Array.isArray(data)) {
        data = [];
      }

      // Calculate dashboard stats
      const total = data.length;
      const pending = data.filter((claim) => claim.status === "Pending").length;
      const approved = data.filter(
        (claim) => claim.status === "Approved"
      ).length;
      const rejected = data.filter(
        (claim) => claim.status === "Rejected"
      ).length;
      const totalAmount = data.reduce(
        (sum, claim) => sum + (claim.claimAmount || 0),
        0
      );

      setStats({
        total,
        pending,
        approved,
        rejected,
        totalAmount,
      });

      if (filterStatus) {
        data = data.filter((claim) => claim.status === filterStatus);
      }

      setClaims(data);
    } catch (error) {
      toast.error("Failed to fetch claims.");
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [token, filterStatus]);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      case "Pending":
        return "#ff9800";
      default:
        return "#9e9e9e";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircleIcon fontSize="small" />;
      case "Rejected":
        return <CancelIcon fontSize="small" />;
      case "Pending":
        return <HourglassEmptyIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Format currency with Rupee symbol
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DashboardIcon sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Insurer Dashboard
            </Typography>
          </Box>

          <Box>
            <Tooltip title="Refresh data">
              <IconButton
                color="primary"
                onClick={fetchClaims}
                sx={{
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  mr: 1,
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.2)" },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 1,
                backgroundColor: "white",
                border: "1px solid rgba(25, 118, 210, 0.2)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography color="textSecondary" variant="subtitle2">
                    Total Claims
                  </Typography>
                  <AssignmentIcon color="primary" />
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  {stats.total}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  Value: {formatCurrency(stats.totalAmount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 1,
                backgroundColor: "white",
                border: "1px solid rgba(255, 152, 0, 0.2)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography color="textSecondary" variant="subtitle2">
                    Pending
                  </Typography>
                  <HourglassEmptyIcon sx={{ color: "#ff9800" }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  {stats.pending}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {stats.pending > 0
                    ? `${Math.round(
                        (stats.pending / stats.total) * 100
                      )}% of total`
                    : "No pending claims"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 1,
                backgroundColor: "white",
                border: "1px solid rgba(76, 175, 80, 0.2)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography color="textSecondary" variant="subtitle2">
                    Approved
                  </Typography>
                  <CheckCircleIcon sx={{ color: "#4caf50" }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  {stats.approved}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {stats.approved > 0
                    ? `${Math.round(
                        (stats.approved / stats.total) * 100
                      )}% of total`
                    : "No approved claims"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 1,
                backgroundColor: "white",
                border: "1px solid rgba(244, 67, 54, 0.2)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography color="textSecondary" variant="subtitle2">
                    Rejected
                  </Typography>
                  <CancelIcon sx={{ color: "#f44336" }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  {stats.rejected}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {stats.rejected > 0
                    ? `${Math.round(
                        (stats.rejected / stats.total) * 100
                      )}% of total`
                    : "No rejected claims"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Bar */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            mb: 3,
            backgroundColor: "#f8f9fa",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FilterListIcon sx={{ mr: 1, color: "#666" }} />
                <TextField
                  select
                  label="Filter by Status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: 180,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem value="">All Claims</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>
              </Box>

              <Box>
                <Badge
                  badgeContent={filterStatus ? claims.length : null}
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {filterStatus
                      ? `Showing ${claims.length} ${filterStatus} claims`
                      : `Showing all ${claims.length} claims`}
                  </Typography>
                </Badge>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Claims Table */}
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={6}
            mb={6}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Loading claims data...
            </Typography>
          </Box>
        ) : claims.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              textAlign: "center",
              py: 6,
              borderRadius: 3,
              backgroundColor: "#f8f9fa",
              border: "1px solid #e0e0e0",
            }}
          >
            <AssignmentIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No claims found
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              {filterStatus
                ? `There are no claims with status "${filterStatus}". Try changing the filter or check back later.`
                : "There are no claims in the system yet. Check back later or refresh the page."}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchClaims}
              sx={{ mt: 3, borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Card>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Claimant
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Claim Amount
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Submission Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Approved Amount
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: `${
                              claim.name.charAt(0).toLowerCase() > "m"
                                ? "#1976d2"
                                : "#f44336"
                            }`,
                            width: 36,
                            height: 36,
                            mr: 2,
                          }}
                        >
                          {claim.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {claim.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {claim.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {formatCurrency(claim.claimAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(claim.status)}
                        label={claim.status}
                        size="small"
                        sx={{
                          bgcolor: `${getStatusColor(claim.status)}20`,
                          color: getStatusColor(claim.status),
                          fontWeight: "bold",
                          border: `1px solid ${getStatusColor(claim.status)}40`,
                          "& .MuiChip-icon": {
                            color: getStatusColor(claim.status),
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(claim.submissionDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(claim.submissionDate).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {claim.approvedAmount ? (
                        <Typography
                          variant="subtitle2"
                          color="success.main"
                          fontWeight="bold"
                        >
                          {formatCurrency(claim.approvedAmount)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Not applicable
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/review/${claim._id}`}
                        startIcon={<VisibilityIcon />}
                        sx={{
                          borderRadius: 2,
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default InsurerDashboard;
