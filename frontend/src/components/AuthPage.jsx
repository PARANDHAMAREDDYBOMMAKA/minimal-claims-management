import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  HealthAndSafety,
  Business,
  Login as LoginIcon,
  HowToReg,
} from "@mui/icons-material";
import axios from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = ({ setUser, setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to determine which form to show based on URL
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false);
    } else if (location.pathname === "/login") {
      setIsLogin(true);
    }
  }, [location]);

  // Function to handle navigation and animation
  const handleFormSwitch = (path) => {
    navigate(path);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: "relative",
          perspective: "1200px",
        }}
      >
        <Box sx={{ position: "relative", transformStyle: "preserve-3d" }}>
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, rotateY: -10, x: 100 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: 10, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ width: "100%" }}
              >
                <LoginForm
                  setUser={setUser}
                  setToken={setToken}
                  onSwitchForm={() => handleFormSwitch("/register")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, rotateY: 10, x: -100 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -10, x: 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ width: "100%" }}
              >
                <RegisterForm onSwitchForm={() => handleFormSwitch("/login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Container>
  );
};

const GlassmorphicCard = ({ children }) => (
  <Box
    sx={{
      background: "rgba(255, 255, 255, 0.25)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      padding: 4,
      overflow: "hidden",
      width: "100%",
    }}
  >
    {children}
  </Box>
);

const LoginForm = ({ setUser, setToken, onSwitchForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/users/login", { email, password });
      const { access_token } = res.data;
      const decoded = jwtDecode(access_token);
      const userData = {
        email: decoded.email,
        role: decoded.role,
        userId: decoded.sub,
      };
      setUser(userData);
      setToken(access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", access_token);

      // Show success animation before redirecting
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassmorphicCard>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="500">
            Welcome Back
          </Typography>
        </motion.div>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to access your dashboard
          </Typography>
        </motion.div>
      </Box>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.09)",
                borderRadius: "8px",
              },
            }}
          />
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255, 255, 255, 0.09)",
                borderRadius: "8px",
              },
            }}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: 4,
              mb: 3,
              py: 1.5,
              borderRadius: "8px",
              background: "linear-gradient(90deg, #1976d2, #64b5f6)",
              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
            }}
            startIcon={<LoginIcon />}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </motion.div>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ textAlign: "center" }}
        >
          <Typography>Don't have an account? </Typography>
          <Button
            onClick={onSwitchForm}
            color="secondary"
            sx={{ mt: 1 }}
            startIcon={<HowToReg />}
          >
            Create an account
          </Button>
        </motion.div>
      </form>
    </GlassmorphicCard>
  );
};

const RegisterForm = ({ onSwitchForm }) => {
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

  const steps = ["Account Info", "Security", "Confirmation"];

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
      setTimeout(() => onSwitchForm(), 2000);
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
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
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
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.09)",
                    borderRadius: "8px",
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
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
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.09)",
                    borderRadius: "8px",
                  },
                }}
              />
            </motion.div>
          </>
        );
      case 1:
        return (
          <>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
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
                      <Lock color="primary" />
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
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.09)",
                    borderRadius: "8px",
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
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
                      <Lock color="primary" />
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
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.09)",
                    borderRadius: "8px",
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.09)",
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="patient">
                  <HealthAndSafety sx={{ mr: 1 }} color="primary" /> Patient
                </MenuItem>
                <MenuItem value="insurer">
                  <Business sx={{ mr: 1 }} color="primary" /> Insurer
                </MenuItem>
              </TextField>
            </motion.div>
          </>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: "center",
                py: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: 3,
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="500">
                Review Your Information
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Name:</strong> {formData.name}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Email:</strong> {formData.email}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Role:</strong>{" "}
                {formData.role === "patient" ? "Patient" : "Insurer"}
              </Typography>
            </Box>
          </motion.div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <GlassmorphicCard>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="500">
            Create Account
          </Typography>
        </motion.div>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Join us to access all features
          </Typography>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 4,
            "& .MuiStepLabel-root .Mui-completed": {
              color: "primary.main",
            },
            "& .MuiStepLabel-root .Mui-active": {
              color: "secondary.main",
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </motion.div>

      <form>{getStepContent(activeStep)}</form>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              sx={{
                borderRadius: "8px",
                border: "1px solid rgba(25, 118, 210, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.05)",
                },
              }}
            >
              Back
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                borderRadius: "8px",
                background: "linear-gradient(90deg, #1976d2, #64b5f6)",
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                },
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              variant="contained"
              sx={{
                borderRadius: "8px",
                background: "linear-gradient(90deg, #1976d2, #64b5f6)",
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                },
              }}
              startIcon={<HowToReg />}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          )}
        </motion.div>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{ textAlign: "center" }}
      >
        <Typography>Already have an account? </Typography>
        <Button
          onClick={onSwitchForm}
          color="secondary"
          sx={{ mt: 1 }}
          startIcon={<LoginIcon />}
        >
          Sign in
        </Button>
      </motion.div>
    </GlassmorphicCard>
  );
};

export default AuthPage;
