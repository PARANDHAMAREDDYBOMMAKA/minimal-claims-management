import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/api";
import { toast } from "react-toastify";

function PatientClaimForm() {
  const { user } = useAuth(); // Get user info from AuthContext
  const [formData, setFormData] = useState({
    name: "",
    claimAmount: 0,
    description: "",
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes—ensure claimAmount is numeric
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

  // Handle form submission
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
      if (!documentFile) {
        // Send JSON payload when no file is attached
        const jsonData = {
          name: formData.name,
          email: user.email,
          claimAmount: Number(formData.claimAmount),
          description: formData.description,
        };
        console.log("Final JSON payload being sent:", jsonData);
        await axios.post("/claims", jsonData);
      } else {
        // Send FormData payload when file is attached
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", user.email);
        // Append claimAmount as a plain string so it's treated as a normal field
        data.append("claimAmount", formData.claimAmount.toString());
        data.append("description", formData.description);
        data.append("document", documentFile);
        console.log(
          "Final FormData payload being sent:",
          Object.fromEntries(data)
        );
        await axios.post("/claims", data);
      }
      toast.success("Claim submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting claim:", err);
      toast.error(err.response?.data?.message || "Failed to submit claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 600,
        margin: "auto",
        backgroundColor: "#ffffff",
        boxShadow: 3,
        borderRadius: 2,
      }}
      component={Paper}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Submit a Claim
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Claim Amount ($)"
          name="claimAmount"
          type="text"
          value={formData.claimAmount}
          onChange={handleChange}
          margin="normal"
          required
        />
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
        />

        <Box sx={{ mt: 2 }}>
          <InputLabel>Upload Supporting Document (optional)</InputLabel>
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
              sx={{ mt: 1 }}
            >
              {documentFile ? "Change File" : "Upload File"}
            </Button>
          </label>
          {documentFile && (
            <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: "gray" }} />
              <Typography variant="body2">{documentFile.name}</Typography>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 3, py: 1.5 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Claim"}
        </Button>
      </form>
    </Box>
  );
}

export default PatientClaimForm;
