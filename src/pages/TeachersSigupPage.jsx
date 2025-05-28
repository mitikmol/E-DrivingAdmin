import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

export default function TeacherSignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const validateField = (name, value) => {
  let error = '';

  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!value.trim()) error = 'This field is required';
      else if (value.length < 2) error = 'Must be at least 2 characters';
      else if (!/^[a-zA-Z]+$/.test(value)) error = 'Only letters allowed';
      break;

    case 'email':
      if (!value) error = 'Email is required';
      else if (!/^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)) {
        error = 'Invalid email format: must start with lowercase letter and contain no uppercase letters';
      }
      break;

    case 'phoneNumber':
      if (!value) error = 'Phone number is required';
      else if (!/^(09|07)\d{8}$/.test(value)) {
        error = 'Phone number must start with 09 or 07 and be exactly 10 digits';
      }
      break;

    case 'password':
      if (!value) error = 'Password is required';
      else if (value.length < 8) error = 'Password must be at least 8 characters';
      else if (!/(?=.*[A-Z])/.test(value)) error = 'Must contain at least one uppercase letter';
      else if (!/(?=.*[0-9])/.test(value)) error = 'Must contain at least one number';
      break;

    default:
      break;
  }

  return error;
};

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate the field when it loses focus
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate the field as user types (only if it's been touched)
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: true
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(
        'https://driving-backend-stmb.onrender.com/api/teachers/signup',
        formData
      );
      setResult(res.data);
      setSuccessOpen(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
      });
      // Reset touched state after successful submission
      setTouched({
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        password: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        minHeight: '100vh',
        p: 2
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 480, borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
            Teacher Registration
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {[
              { name: 'firstName', label: 'First Name' },
              { name: 'lastName', label: 'Last Name' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
              { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password' }
            ].map((field, idx) => (
              <TextField
                key={idx}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={formData[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
                InputProps={
                  field.name === 'password'
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    : undefined
                }
              />
            ))}

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Teacher has been registered successfully.
          </DialogContentText>
          {result && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>ID:</strong> {result.id}</Typography>
              <Typography variant="body2"><strong>Name:</strong> {result.firstName} {result.lastName}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {result.email}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {result.phoneNumber}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
