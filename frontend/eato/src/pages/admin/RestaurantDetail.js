// pages/admin/RestaurantDetail.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Divider, 
  CircularProgress,
  Stack,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StoreIcon from '@mui/icons-material/Store';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate, useParams } from 'react-router-dom';
import restaurantApi from '../../services/restaurant-service/api';
import { toast } from 'react-toastify';

const RestaurantDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foodItemsLoading, setFoodItemsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantData();
    fetchFoodItems();
  }, [id]);

  const fetchRestaurantData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await restaurantApi.getRestaurantById(id);
      
      if (response && response.success) {
        setRestaurant(response.data);
      } else {
        setError('Failed to fetch restaurant details');
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      setError('An error occurred while loading restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodItems = async () => {
    setFoodItemsLoading(true);
    
    try {
      const response = await restaurantApi.getRestaurantFoodItems(id);
      
      if (response && response.success) {
        setFoodItems(response.data);
      }
    } catch (err) {
      console.error('Error fetching food items:', err);
      // Not showing this error to avoid UI clutter
    } finally {
      setFoodItemsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/restaurants');
  };

  const handleEdit = () => {
    navigate(`/admin/restaurants/edit/${id}`);
  };

  const handleManageFoodItems = () => {
    navigate(`/admin/restaurants/${id}/food-items`);
  };

  // Helper to format operating hours
  const formatOperatingHours = (hours) => {
    if (!hours) return 'Not specified';
    
    try {
      if (typeof hours === 'string') {
        return hours;
      }
      
      // Format if it's an object with open/close times
      if (hours.open && hours.close) {
        return `${hours.open} - ${hours.close}`;
      }
      
      return JSON.stringify(hours);
    } catch (error) {
      return 'Invalid format';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Box>
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Restaurant
        </Typography>
        <Typography paragraph>{error || 'Restaurant not found'}</Typography>
        <Button 
          startIcon={<ArrowBackIcon />}
          variant="contained"
          onClick={handleBack}
        >
          Back to Restaurants
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Restaurant Details
        </Typography>
        <Box>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Basic Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">
                {restaurant.name}
              </Typography>
              <Chip 
                label={restaurant.isActive ? "Active" : "Inactive"} 
                color={restaurant.isActive ? "success" : "default"}
              />
            </Box>
            
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Chip 
                icon={<RestaurantIcon />}
                label={restaurant.cuisine || 'No cuisine specified'} 
                variant="outlined"
                color="primary"
                sx={{ mr: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              {restaurant.description || 'No description provided.'}
            </Typography>
            
            <List sx={{ mt: 2 }}>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Address" 
                  secondary={restaurant.address || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone Number" 
                  secondary={restaurant.phoneNumber || 'Not specified'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Operating Hours" 
                  secondary={formatOperatingHours(restaurant.operatingHours)} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Right Column - Image and Actions */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              {restaurant.imageUrl ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.imageUrl}
                  alt={restaurant.name}
                  sx={{ borderRadius: 1, mb: 2 }}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 200, 
                    bgcolor: 'grey.200', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  <StoreIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                </Box>
              )}
              
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<FastfoodIcon />}
                onClick={handleManageFoodItems}
                sx={{ mt: 2 }}
              >
                Manage Food Items
              </Button>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Restaurant Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    ID
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    {restaurant._id}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Created On
                  </Typography>
                  <Typography variant="body1">
                    {new Date(restaurant.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Menu Items
                  </Typography>
                  <Typography variant="body1">
                    {foodItemsLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      `${foodItems.length} items`
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Grid>
        
        {/* Food Items Preview */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Food Items
              </Typography>
              <Button
                onClick={handleManageFoodItems}
                variant="outlined"
                size="small"
              >
                Manage All Items
              </Button>
            </Box>
            
            {foodItemsLoading ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
              </Box>
            ) : foodItems.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  No food items available for this restaurant.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleManageFoodItems}
                >
                  Add Food Items
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {foodItems.slice(0, 4).map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item._id}>
                    <Card elevation={1}>
                      {item.imageUrl ? (
                        <CardMedia
                          component="img"
                          height="140"
                          image={item.imageUrl}
                          alt={item.name}
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            height: 140, 
                            bgcolor: 'grey.100', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FastfoodIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                        </Box>
                      )}
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {item.price?.toFixed(2) || '0.00'} USD
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                
                {foodItems.length > 4 && (
                  <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      onClick={handleManageFoodItems}
                      variant="text"
                    >
                      View {foodItems.length - 4} more items
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantDetail;