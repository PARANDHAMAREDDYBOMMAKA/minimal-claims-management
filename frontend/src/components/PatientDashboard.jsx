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
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Use auth context for token
import axios from "../services/api";
import { toast } from "react-toastify";
import { MonetizationOn, Event, AssignmentTurnedIn } from "@mui/icons-material";
import io from "socket.io-client"; // ✅ WebSockets for real-time updates

const socket = io("http://localhost:3000"); // ✅ Replace with actual backend WebSocket URL

function PatientDashboard() {
  const { user } = useAuth(); // ✅ Use AuthProvider safely

  if (!user) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Unauthorized! Please log in.
        </Typography>
        <Button variant="contained" component={Link} to="/login" sx={{ mt: 2 }}>
          Go to Login
        </Button>
      </Box>
    );
  }

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get("/claims"); // ✅ Token auto-handled in api.js

        if (res.data && Array.isArray(res.data.claims)) {
          setClaims(res.data.claims);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
        toast.error("Failed to fetch claims. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();

    // ✅ WebSocket listener for real-time updates
    socket.on("claimUpdated", (updatedClaim) => {
      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim._id === updatedClaim._id ? updatedClaim : claim
        )
      );
      toast.info(`Claim status updated to: ${updatedClaim.status}`);
    });

    return () => {
      socket.off("claimUpdated");
    };
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name} 👋
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/submit"
        sx={{ mb: 3 }}
        color="primary"
      >
        Submit New Claim
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : claims.length === 0 ? (
        <Typography>No claims found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <AssignmentTurnedIn color="primary" /> Name
                </TableCell>
                <TableCell>
                  <MonetizationOn color="success" /> Claim Amount
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  <Event color="secondary" /> Submission Date
                </TableCell>
                <TableCell>Approved Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim._id}>
                  <TableCell>{claim.name}</TableCell>
                  <TableCell>₹{claim.claimAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={claim.status}
                      color={
                        claim.status === "Approved"
                          ? "success"
                          : claim.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(claim.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {claim.approvedAmount ? `₹${claim.approvedAmount}` : "-"}
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

export default PatientDashboard;
