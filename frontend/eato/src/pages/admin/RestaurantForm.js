// pages/admin/RestaurantForm.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControlLabel, 
  Switch, 
  Divider,
  MenuItem, 
  InputLabel,
  FormControl,
  Select,
  CircularProgress,
  FormHelperText,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useParams } from 'react-router-dom';
import restaurantApi from '../../services/restaurant-service/api';
import { toast } from 'react-toastify';

// Cuisine options for dropdown
const CUISINE_OPTIONS = [
  'Italian', 'Chinese', 'Indian', 'Japanese', 'Mexican', 
  'Thai', 'American', 'French', 'Mediterranean', 'Middle Eastern',
  'Korean', 'Vietnamese', 'Greek', 'Spanish', 'Other'
];

const RestaurantForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    cuisine: '',
    imageUrl: '',
    isActive: true,
    operatingHours: {
      open: '09:00',
      close: '22:00'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch restaurant data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    setFetchLoading(true);
    setError(null);
    
    try {
      const response = await restaurantApi.getRestaurantById(id);
      
      if (response && response.success) {
        // Format the operating hours if needed
        let operatingHours = response.data.operatingHours;
        if (typeof operatingHours === 'string') {
          try {
            operatingHours = JSON.parse(operatingHours);
          } catch (e) {
            // If can't parse, create a default object
            operatingHours = { open: '09:00', close: '22:00' };
          }
        } else if (!operatingHours || typeof operatingHours !== 'object') {
          operatingHours = { open: '09:00', close: '22:00' };
        }
        
        setFormData({
          ...response.data,
          operatingHours
        });
      } else {
        setError('Failed to fetch restaurant data');
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      setError('An error occurred while fetching restaurant data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleOperatingHoursChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [name]: value
      }
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Restaurant name is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.cuisine) errors.cuisine = 'Cuisine type is required';
    
    // Phone number validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      const finalFormData = {
        ...formData,
        operatingHours: formData.operatingHours
      };
      
      if (isEditMode) {
        response = await restaurantApi.updateRestaurant(id, finalFormData);
      } else {
        response = await restaurantApi.createRestaurant(finalFormData);
      }
      
      if (response && response.success) {
        toast.success(
          isEditMode 
            ? 'Restaurant updated successfully' 
            : 'Restaurant created successfully'
        );
        navigate('/admin/restaurants');
      } else {
        setError('Failed to save restaurant');
        toast.error('Failed to save restaurant');
      }
    } catch (err) {
      console.error('Error saving restaurant:', err);
      
      // Handle validation errors from the backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while saving the restaurant');
      }
      
      toast.error('An error occurred while saving the restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/restaurants');
  };

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Restaurant' : 'Create Restaurant'}
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
        >
          Back to List
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Restaurant Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(validationErrors.name)}
                helperText={validationErrors.name}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={Boolean(validationErrors.cuisine)}>
                <InputLabel id="cuisine-label">Cuisine</InputLabel>
                <Select
                  labelId="cuisine-label"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  label="Cuisine"
                >
                  {CUISINE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.cuisine && (
                  <FormHelperText>{validationErrors.cuisine}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(validationErrors.address)}
                helperText={validationErrors.address}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="e.g. +1 234 567 8901"
                error={Boolean(validationErrors.phoneNumber)}
                helperText={validationErrors.phoneNumber || "Include country code if applicable"}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                fullWidth
                placeholder="https://example.com/image.jpg"
                helperText="URL to restaurant image (optional)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Operating Hours
                </Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Opening Time"
                name="open"
                type="time"
                value={formData.operatingHours.open}
                onChange={handleOperatingHoursChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Closing Time"
                name="close"
                type="time"
                value={formData.operatingHours.close}
                onChange={handleOperatingHoursChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active (visible to customers)"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Restaurant'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default RestaurantForm;