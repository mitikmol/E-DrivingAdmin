
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { updateAuthInfo } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const signupRes = await axios.post(
        'https://driving-backend-stmb.onrender.com/api/admin/signup',
        form,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    
      console.log('Signup successful:', signupRes.data);
    
      // Clear form fields
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    
      
      setSuccessMessage('Admin registered successfully!');
    
      // Optional: Auto-hide success message
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      console.error('Signup Error:', err?.response?.data || err.message);
      const message = err?.response?.data?.message || 'Signup failed. Please try again.';
      alert(message);
    }
    finally {
      setIsLoading(false);
    }    
  };

  return (
    <Box
      sx={{
        minHeight: '50vh',
        minWidth: '70vw',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          Register a new user as admin
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom textAlign="center">
          Please fill in the details below to create a new account.
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, textAlign: 'center' }}>
            {successMessage}
          </Alert>
        )}
        
<Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;