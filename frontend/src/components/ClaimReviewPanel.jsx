import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import { toast } from "react-toastify";

function ClaimReviewPanel({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    status: "",
    approvedAmount: "",
    insurerComments: "",
  });

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await axios.get(`/claims/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setClaim(res.data);
          setFormData({
            status: res.data.status,
            approvedAmount: res.data.approvedAmount || "",
            insurerComments: res.data.insurerComments || "",
          });
        }
      } catch (err) {
        console.error("Error fetching claim:", err);
        toast.error("Failed to load claim details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id, token]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "approvedAmount") {
      value = value.replace(/[^0-9.]/g, ""); // Allow only numbers & dots
      value = value ? parseFloat(value) : ""; // Convert to number if valid
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.status === "Approved" &&
      (isNaN(formData.approvedAmount) || formData.approvedAmount <= 0)
    ) {
      toast.error("Approved amount must be a positive number.");
      return;
    }

    try {
      const payload = {
        ...formData,
        approvedAmount:
          formData.status === "Approved"
            ? Number(formData.approvedAmount)
            : null, // Ensure correct format
      };

      await axios.put(`/claims/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Claim updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating claim:", err);
      toast.error(err.response?.data?.message || "Failed to update claim.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Review Claim
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="body1">
              <strong>Name:</strong> {claim.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {claim.email}
            </Typography>
            <Typography variant="body1">
              <strong>Claim Amount:</strong> ${claim.claimAmount.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Description:</strong> {claim.description}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Typography variant="body1">
                <strong>Status:</strong>
              </Typography>
              <Chip
                label={claim.status}
                color={
                  claim.status === "Approved"
                    ? "success"
                    : claim.status === "Rejected"
                    ? "error"
                    : "warning"
                }
                sx={{ fontSize: "14px", fontWeight: "bold", ml: 1 }}
              />
            </Box>

            {claim.document && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  href={`http://localhost:3000/uploads/${claim.document}`}
                  target="_blank"
                >
                  View Document
                </Button>
              </Box>
            )}
          </Paper>

          <form onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Approved Amount ($)"
              name="approvedAmount"
              type="text"
              value={formData.approvedAmount}
              onChange={handleChange}
              margin="normal"
              disabled={formData.status !== "Approved"}
              required={formData.status === "Approved"}
            />
            <TextField
              fullWidth
              label="Comments"
              name="insurerComments"
              multiline
              rows={3}
              value={formData.insurerComments}
              onChange={handleChange}
              margin="normal"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 3, py: 1.5 }}
            >
              Update Claim
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ClaimReviewPanel;
