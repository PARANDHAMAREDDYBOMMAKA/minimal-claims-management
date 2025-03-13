import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  CircularProgress,
  Fade,
  Grow,
  Slide,
  
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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

  // Handle input changes
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "claimAmount") {
      value = value.toString().replace(/[^0-9.]/g, "");
      if (value !== "" && !isNaN(value)) {
        value = parseFloat(value);
        if (value < 0) value = 0;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  // New function to handle view details
  const handleViewDetails = async () => {
    if (!claimId) {
      toast.error("Please enter a claim ID to view details");
      return;
    }

    setFetchingDetails(true);
    try {
      const response = await axios.get(`/claims/${claimId}`);

      if (response.data) {
        setClaimDetails(response.data);
        setDetailsDialogOpen(true);
      } else {
        toast.error("Claim not found");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch claim details"
      );
    } finally {
      setFetchingDetails(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const payload = {
        name: formData.name,
        email: user.email,
        claimAmount: Number(formData.claimAmount),
        description: formData.description,
      };

      let response;

      if (!documentFile) {
        response = await axios.post("/claims", payload);
      } else {
        const formDataObj = new FormData();
        formDataObj.append("name", payload.name);
        formDataObj.append("email", payload.email);
        formDataObj.append("claimAmount", payload.claimAmount.toString());
        formDataObj.append("description", payload.description);
        formDataObj.append("document", documentFile);

        response = await axios.post("/claims", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Claim submitted successfully!");

      if (response?.data?.id) {
        setClaimId(response.data.id);
        setClaimDetails(response.data);
        setDetailsDialogOpen(true);
      }

      setFormData({
        name: "",
        claimAmount: 0,
        description: "",
      });
      setDocumentFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit claim.");
    } finally {
      setLoading(false);
    }
  };

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
          transform: "translateZ(0)",
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
              label="Claim Amount (₹)"
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
                Upload Supporting Document
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
      </Box>
    </Fade>
  );
}

export default PatientClaimForm;
