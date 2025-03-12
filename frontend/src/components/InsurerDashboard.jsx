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
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../services/api";
import { toast } from "react-toastify";

function InsurerDashboard({ token }) {
  const [claims, setClaims] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Claims API response:", response.data);

      let data = response.data.claims || []; // ✅ Extracting the correct `claims` array

      if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        data = [];
      }

      if (filterStatus) {
        data = data.filter((claim) => claim.status === filterStatus);
      }

      setClaims(data);
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("Failed to fetch claims.");
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [token, filterStatus]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Insurer Dashboard
      </Typography>

      {/* Filter & Refresh */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          p: 2,
          bgcolor: "#f5f5f5",
          borderRadius: 2,
        }}
      >
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" onClick={fetchClaims}>
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : claims.length === 0 ? (
        <Typography textAlign="center" mt={3}>
          No claims found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1976d2", color: "white" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Claim Amount</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Submission Date</TableCell>
                <TableCell sx={{ color: "white" }}>Approved Amount</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim._id}>
                  <TableCell>{claim.name}</TableCell>
                  <TableCell>{claim.email}</TableCell>
                  <TableCell>${claim.claimAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={claim.status}
                      color={
                        claim.status === "Approved"
                          ? "success"
                          : claim.status === "Rejected"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(claim.submissionDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {claim.approvedAmount ? `$${claim.approvedAmount}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/review/${claim._id}`}
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
  );
}

export default InsurerDashboard;
