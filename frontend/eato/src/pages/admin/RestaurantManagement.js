// pages/admin/RestaurantManagement.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import UserTypeChecker from '../../components/common/UserTypeChecker';
import useAuth from '../../hooks/useAuth';
import api from '../../services/restaurant-service/api';
const { restaurantApi } = api;

const RestaurantManagement = () => {
  const { currentUser } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    cuisine: '',
    operatingHours: '',
    imageUrl: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load all restaurants
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await restaurantApi.getMyRestaurants();
      if (response.success) {
        setRestaurants(response.data);
      } else {
        setError(response.message || 'Failed to fetch restaurants');
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Unable to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (restaurant = null) => {
    if (restaurant) {
      setCurrentRestaurant(restaurant);
      setFormData({
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phoneNumber: restaurant.phoneNumber,
        cuisine: restaurant.cuisine,
        operatingHours: restaurant.operatingHours,
        imageUrl: restaurant.imageUrl || ''
      });
    } else {
      setCurrentRestaurant(null);
      setFormData({
        name: '',
        description: '',
        address: '',
        phoneNumber: '',
        cuisine: '',
        operatingHours: '',
        imageUrl: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      let response;
      
      if (currentRestaurant) {
        // Update existing restaurant
        response = await restaurantApi.updateRestaurant(currentRestaurant._id, formData);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Restaurant updated successfully!',
            severity: 'success'
          });
          
          // Update local state
          setRestaurants(restaurants.map(r => 
            r._id === currentRestaurant._id ? response.data : r
          ));
        }
      } else {
        // Create new restaurant
        response = await restaurantApi.createRestaurant(formData);
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Restaurant created successfully!',
            severity: 'success'
          });
          
          // Add to local state
          setRestaurants([...restaurants, response.data]);
        }
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving restaurant:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.message || 'Failed to save restaurant'}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (restaurant) => {
    setCurrentRestaurant(restaurant);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await restaurantApi.deleteRestaurant(currentRestaurant._id);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Restaurant deleted successfully!',
          severity: 'success'
        });
        
        // Remove from local state
        setRestaurants(restaurants.filter(r => r._id !== currentRestaurant._id));
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.message || 'Failed to delete restaurant'}`,
        severity: 'error'
      });
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Restaurant Management
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Restaurant
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : restaurants.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            bgcolor: 'rgba(0,0,0,0.02)', 
            borderRadius: 2 
          }}
        >
          <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No restaurants found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Get started by adding your first restaurant
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Restaurant
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={restaurant.imageUrl || '/default-restaurant.jpg'}
                  alt={restaurant.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {restaurant.name}
                    </Typography>
                    <Chip 
                      label={restaurant.cuisine} 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {restaurant.description.length > 100 
                      ? `${restaurant.description.substring(0, 100)}...` 
                      : restaurant.description}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Address:</strong> {restaurant.address}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {restaurant.phoneNumber}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Hours:</strong> {restaurant.operatingHours}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Tooltip title="Edit Restaurant">
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenDialog(restaurant)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Restaurant">
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteClick(restaurant)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Add/Edit Restaurant Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Restaurant Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="cuisine"
                label="Cuisine Type"
                fullWidth
                required
                value={formData.cuisine}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                required
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                required
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="operatingHours"
                label="Operating Hours (e.g., Mon-Fri: 9AM-10PM)"
                fullWidth
                required
                value={formData.operatingHours}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="imageUrl"
                label="Image URL"
                fullWidth
                value={formData.imageUrl}
                onChange={handleChange}
                helperText="Leave empty to use default image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
          >
            {currentRestaurant ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirmation Dialog for Delete */}
      <UserTypeChecker
        open={openDeleteDialog}
        title="Delete Restaurant"
        content={`Are you sure you want to delete "${currentRestaurant?.name}"? This will also delete all associated food items and cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDeleteDialog(false)}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          elevation={6} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RestaurantManagement;