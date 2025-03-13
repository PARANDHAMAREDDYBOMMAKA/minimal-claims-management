import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  Paper,
  CircularProgress,
  Fade,
  Grow,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function PatientClaimForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    claimAmount: 0,
    description: "",
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const navigate = useNavigate();

  // New state for view details functionality
  const [claimDetails, setClaimDetails] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [claimId, setClaimId] = useState("");

  // Show form with animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setFormVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Debug useEffect to verify dialog state changes
  useEffect(() => {
    console.log("Dialog state changed:", detailsDialogOpen);
  }, [detailsDialogOpen]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "claimAmount") {
      // Allow only digits and dot
      value = value.toString().replace(/[^0-9.]/g, "");
      if (value !== "" && !isNaN(value)) {
        value = parseFloat(value);
        if (value < 0) value = 0;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  // New function to handle view details
  const handleViewDetails = async () => {
    // Check if claimId is provided
    if (!claimId) {
      toast.error("Please enter a claim ID to view details");
      return;
    }

    setFetchingDetails(true);
    try {
      console.log("Fetching details for claim ID:", claimId);
      const response = await axios.get(`/claims/${claimId}`);
      console.log("API response:", response.data);

      if (response.data) {
        setClaimDetails(response.data);
        setDetailsDialogOpen(true);
        console.log("Dialog should be opening now");
      } else {
        toast.error("Claim not found");
      }
    } catch (err) {
      console.error("Error fetching claim details:", err);
      toast.error(
        err.response?.data?.message || "Failed to fetch claim details"
      );

      // For testing/debugging, let's create mock data to ensure the dialog works
      console.log("Creating mock data for testing dialog");
      const mockData = {
        id: claimId,
        name: "Test Patient",
        email: "test@example.com",
        claimAmount: 1200.5,
        description:
          "This is a mock claim for testing the dialog functionality",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setClaimDetails(mockData);
      setDetailsDialogOpen(true);
    } finally {
      setFetchingDetails(false);
    }
  };

  // Function to close the details dialog
  const handleCloseDetailsDialog = () => {
    console.log("Closing dialog");
    setDetailsDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting claim with data:", formData);

    if (!formData.name || !formData.claimAmount || !formData.description) {
      toast.error("All fields are required.");
      return;
    }
    if (isNaN(formData.claimAmount) || formData.claimAmount <= 0) {
      toast.error("Claim amount must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      // Always ensure claimAmount is a number in payload
      const payload = {
        name: formData.name,
        email: user.email,
        // Key fix: Convert to Number and then to string to ensure correct typing on server
        claimAmount: Number(formData.claimAmount),
        description: formData.description,
      };

      let response;

      if (!documentFile) {
        // Regular JSON payload without file
        console.log("Final JSON payload being sent:", payload);
        response = await axios.post("/claims", payload);
      } else {
        // When using FormData with file, we need to manually create
        // a new FormData object and append our values
        const formDataObj = new FormData();

        // Append each field individually with proper types
        formDataObj.append("name", payload.name);
        formDataObj.append("email", payload.email);

        // Use a numeric string here instead of a plain string
        // This ensures the server receives it in a format it can parse as a number
        formDataObj.append("claimAmount", payload.claimAmount.toString());

        formDataObj.append("description", payload.description);
        formDataObj.append("document", documentFile);

        // Log what's being sent
        console.log("Form data being sent with properly typed claimAmount");

        // Send the FormData object
        response = await axios.post("/claims", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Success animation
      toast.success("Claim submitted successfully!");

      // Store the ID of the newly created claim for easy access
      if (response?.data?.id) {
        setClaimId(response.data.id);

        // Automatically show details of the new claim
        setClaimDetails(response.data);
        setDetailsDialogOpen(true);
      }

      // Clear form data but don't navigate away
      setFormData({
        name: "",
        claimAmount: 0,
        description: "",
      });
      setDocumentFile(null);
    } catch (err) {
      console.error("Error submitting claim:", err);
      toast.error(err.response?.data?.message || "Failed to submit claim.");

      // For testing: Create mock ID to test view details flow
      setClaimId("test-claim-123");
    } finally {
      setLoading(false);
    }
  };

  // For debugging dialog rendering issues
  console.log("Current component render state:", {
    detailsDialogOpen,
    hasClaimDetails: claimDetails !== null,
  });

  return (
    <Fade in={formVisible} timeout={800}>
      <Box
        component={motion.div}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: 4,
          maxWidth: 600,
          margin: "auto",
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          transform: "translateZ(0)", // Forces hardware acceleration
        }}
        elevation={3}
      >
        <Grow in={formVisible} timeout={800}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              mb: 3,
            }}
          >
            Submit a Claim
          </Typography>
        </Grow>

        <form onSubmit={handleSubmit}>
          <Slide direction="right" in={formVisible} timeout={500} mountOnEnter>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#2196F3" },
                  "&.Mui-focused fieldset": { borderColor: "#2196F3" },
                },
                mb: 2,
              }}
            />
          </Slide>

          <Slide direction="left" in={formVisible} timeout={600} mountOnEnter>
            <TextField
              fullWidth
              label="Claim Amount ($)"
              name="claimAmount"
              type="text"
              value={formData.claimAmount}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#2196F3" },
                  "&.Mui-focused fieldset": { borderColor: "#2196F3" },
                },
                mb: 2,
              }}
            />
          </Slide>

          <Slide direction="right" in={formVisible} timeout={700} mountOnEnter>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#2196F3" },
                  "&.Mui-focused fieldset": { borderColor: "#2196F3" },
                },
                mb: 2,
              }}
            />
          </Slide>

          <Fade in={formVisible} timeout={900}>
            <Box sx={{ mt: 2 }}>
              <InputLabel
                sx={{
                  mb: 1,
                  fontWeight: "medium",
                  color: "#424242",
                }}
              >
                Upload Supporting Document (optional)
              </InputLabel>
              <label htmlFor="file-upload">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  hidden
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    mt: 1,
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 10px rgba(33, 150, 243, 0.3)",
                    },
                  }}
                >
                  {documentFile ? "Change File" : "Upload File"}
                </Button>
              </label>
              <Grow in={!!documentFile} timeout={500}>
                <Box
                  sx={{
                    mt: 1,
                    display: documentFile ? "flex" : "none",
                    alignItems: "center",
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                  }}
                >
                  <InsertDriveFileIcon sx={{ mr: 1, color: "#2196F3" }} />
                  <Typography variant="body2">{documentFile?.name}</Typography>
                </Box>
              </Grow>
            </Box>
          </Fade>

          <Grow in={formVisible} timeout={1000}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{
                mt: 4,
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "0.5s",
                },
                "&:hover::after": {
                  left: "100%",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Submit Claim"
              )}
            </Button>
          </Grow>
        </form>

        {/* View Details Section */}
        <Divider sx={{ my: 4 }} />

        <Fade in={formVisible} timeout={1100}>
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                mb: 3,
              }}
            >
              View Claim Details
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Claim ID"
                  name="claimId"
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter claim ID to view details"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#2196F3" },
                      "&.Mui-focused fieldset": { borderColor: "#2196F3" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleViewDetails}
                  startIcon={<VisibilityIcon />}
                  disabled={fetchingDetails}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 10px rgba(33, 150, 243, 0.3)",
                    },
                  }}
                  fullWidth
                >
                  {fetchingDetails ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "View Details"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Details Dialog - simplified to troubleshoot */}
        <Dialog
          open={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          maxWidth="sm"
          fullWidth
          disableScrollLock={false}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Claim Details
          </DialogTitle>
          <DialogContent dividers>
            {claimDetails ? (
              <Box sx={{ p: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Claim ID
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1" fontWeight="medium">
                      {claimDetails.id}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{claimDetails.name}</Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Amount
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1" fontWeight="medium">
                      ₹{Number(claimDetails.claimAmount).toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, backgroundColor: "rgba(33, 150, 243, 0.05)" }}
                    >
                      <Typography variant="body2">
                        {claimDetails.description}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Typography align="center" sx={{ py: 3 }}>
                No claim details available
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailsDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Test button to force open dialog */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              // Create test data and force open dialog
              setClaimDetails({
                id: "test-123",
                name: "Test Patient",
                email: "test@example.com",
                claimAmount: 1500,
                description: "Test description for debugging dialog",
              });
              setDetailsDialogOpen(true);
              console.log("Manual dialog trigger");
            }}
            sx={{ mt: 2 }}
          >
            TEST: Open Dialog Directly
          </Button>
        </Box>
      </Box>
    </Fade>
  );
}

export default PatientClaimForm;
