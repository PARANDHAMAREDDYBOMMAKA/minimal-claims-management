import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Container,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  HealthAndSafety,
  Business,
} from "@mui/icons-material";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = ["Account Information", "Role & Password", "Confirmation"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
        isValid = false;
      }
      if (!formData.email) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }
    }

    if (step === 1) {
      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    if (!isValid) {
      Object.values(newErrors).forEach((err) => toast.error(err));
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1)) return;

    setLoading(true);

    try {
      const { name, email, password, role } = formData;
      console.log("Sending registration data:", {
        name,
        email,
        password,
        role,
      });

      const response = await axios.post("/users/register", {
        name,
        email,
        password,
        role,
      });

      console.log("Registration success:", response.data);
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              error={Boolean(errors.name)}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={Boolean(errors.email)}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={Boolean(errors.password)}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="patient">
                <HealthAndSafety sx={{ mr: 1 }} color="primary" /> Patient
              </MenuItem>
              <MenuItem value="insurer">
                <Business sx={{ mr: 1 }} color="primary" /> Insurer
              </MenuItem>
            </TextField>
          </>
        );
      case 2:
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Typography>
              <strong>Name:</strong> {formData.name}
            </Typography>
            <Typography>
              <strong>Email:</strong> {formData.email}
            </Typography>
            <Typography>
              <strong>Role:</strong>{" "}
              {formData.role === "patient" ? "Patient" : "Insurer"}
            </Typography>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Register
          </Typography>
          <Stepper activeStep={activeStep} sx={{ my: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={handleSubmit}>{getStepContent(activeStep)}</form>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                variant="contained"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Register;
