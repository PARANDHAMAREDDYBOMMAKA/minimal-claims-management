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
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Backdrop,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import { toast } from "react-toastify";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CommentIcon from "@mui/icons-material/Comment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

function ClaimReviewPanel({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    approvedAmount: "",
    insurerComments: "",
  });

  // Status helpers
  const getStatusStep = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Approved":
        return 1;
      case "Rejected":
        return 1;
      default:
        return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
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
      setSubmitting(true);
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
      setSubmitting(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating claim:", err);
      toast.error(err.response?.data?.message || "Failed to update claim.");
      setSubmitting(false);
    }
  };

  const handleViewDocument = () => {
    setViewingDocument(true);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading claim details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 4, px: isMobile ? 2 : 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton
          onClick={() => navigate("/dashboard")}
          sx={{ mr: 2, bgcolor: "rgba(0,0,0,0.04)" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="500">
          Review Claim #{id.slice(0, 8)}
        </Typography>
      </Box>

      <Stepper
        activeStep={getStatusStep(formData.status)}
        alternativeLabel
        sx={{ mb: 4 }}
      >
        <Step>
          <StepLabel>Submitted</StepLabel>
        </Step>
        <Step>
          <StepLabel>Under Review</StepLabel>
        </Step>
        <Step>
          <StepLabel>Decision</StepLabel>
        </Step>
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Claim Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Claimant
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {claim.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                  <EmailIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Contact Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {claim.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                  <CurrencyRupeeIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Requested Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ₹{claim.claimAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                  <CommentIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {claim.description}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                  <ReceiptIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Status
                  </Typography>
                  <Chip
                    label={claim.status}
                    color={getStatusColor(claim.status)}
                    sx={{ mt: 0.5, fontWeight: "bold" }}
                  />
                </Box>
              </Box>

              {claim.document && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  fullWidth
                  onClick={handleViewDocument}
                  sx={{ mt: 2 }}
                >
                  View Supporting Document
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Review Decision
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleSubmit}>
                <TextField
                  select
                  fullWidth
                  label="Update Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ mb: 2 }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        elevation: 4,
                        sx: { borderRadius: 2 },
                      },
                    },
                  }}
                >
                  <MenuItem value="Pending">
                    <Chip
                      size="small"
                      label="Pending"
                      color="warning"
                      sx={{ mr: 1 }}
                    />
                    Under Review
                  </MenuItem>
                  <MenuItem value="Approved">
                    <Chip
                      size="small"
                      label="Approved"
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    Approve Claim
                  </MenuItem>
                  <MenuItem value="Rejected">
                    <Chip
                      size="small"
                      label="Rejected"
                      color="error"
                      sx={{ mr: 1 }}
                    />
                    Reject Claim
                  </MenuItem>
                </TextField>

                {formData.status === "Approved" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Please specify the approved amount below
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Approved Amount (₹)"
                  name="approvedAmount"
                  type="text"
                  value={formData.approvedAmount}
                  onChange={handleChange}
                  margin="normal"
                  disabled={formData.status !== "Approved"}
                  required={formData.status === "Approved"}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <CurrencyRupeeIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Review Comments"
                  name="insurerComments"
                  multiline
                  rows={4}
                  placeholder="Provide explanation for your decision..."
                  value={formData.insurerComments}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ mb: 3 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/dashboard")}
                    startIcon={<CloseIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    startIcon={<SaveIcon />}
                    sx={{ px: 4 }}
                  >
                    {submitting ? "Updating..." : "Update Claim"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Document Viewer Backdrop */}
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={viewingDocument}
        onClick={() => setViewingDocument(false)}
      >
        <Box
          sx={{
            position: "relative",
            width: "80%",
            height: "80%",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 1,
            boxShadow: 24,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "rgba(0,0,0,0.04)",
            }}
            onClick={() => setViewingDocument(false)}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            src={`http://localhost:3000/uploads/${claim.document}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Document Viewer"
          />
        </Box>
      </Backdrop>
    </Box>
  );
}

export default ClaimReviewPanel;
