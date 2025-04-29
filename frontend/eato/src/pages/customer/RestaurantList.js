//customer\RestaurantList.js
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActionArea,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CustomerLayout from '../../components/layouts/CustomerLayout';
import api from '../../services/api';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/restaurants');
        console.log('Restaurants data:', response.data);
        setRestaurants(response.data.data);
        setFilteredRestaurants(response.data.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants based on search term
    if (searchTerm.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        restaurant => 
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/customer/restaurant/${restaurantId}`);
  };

  // Skeleton loader for restaurants
  const RestaurantSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" width="100%" height={180} />
      <CardContent>
        <Skeleton variant="text" height={30} width="80%" />
        <Skeleton variant="text" height={20} width="60%" />
        <Box sx={{ display: 'flex', mt: 1 }}>
          <Skeleton variant="text" height={24} width={120} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <CustomerLayout>
      <Box sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Restaurants
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Discover and order from the best restaurants in your area
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search restaurants by name, cuisine, or location..."
            sx={{ mt: 2, mb: 4 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {loading ? (
            // Show skeletons while loading
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <RestaurantSkeleton />
              </Grid>
            ))
          ) : filteredRestaurants.length === 0 ? (
            <Box sx={{ width: '100%', textAlign: 'center', py: 5 }}>
              <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                No restaurants found matching your search.
              </Typography>
            </Box>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <CardActionArea onClick={() => handleRestaurantClick(restaurant._id)}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={restaurant.imageUrl || "https://cdn-icons-png.flaticon.com/512/4039/4039232.png"}
                      alt={restaurant.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {restaurant.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {restaurant.address}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 1.5 }}>
                        <Rating 
                          value={restaurant.rating || 4.5} 
                          precision={0.5} 
                          size="small" 
                          readOnly 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({restaurant.ratingCount || '120'})
                        </Typography>
                      </Box>
                      <Box>
                        <Chip 
                          label={restaurant.cuisine} 
                          size="small" 
                          sx={{ mr: 1 }} 
                        />
                        {restaurant.isOpen !== false && (
                          <Chip 
                            label="Open" 
                            size="small" 
                            color="success" 
                          />
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </CustomerLayout>
  );
};

export default RestaurantList;