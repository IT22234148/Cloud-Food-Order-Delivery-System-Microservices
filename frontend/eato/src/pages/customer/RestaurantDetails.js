//customer\RestaurantDetails.js
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  Rating,
  Divider,
  IconButton,
  Skeleton,
  Alert,
  Badge,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CustomerLayout from '../../components/layouts/CustomerLayout';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateItemQuantity } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantAndItems = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurant details
        const restaurantResponse = await api.get(`/api/restaurants/${id}`);
        setRestaurant(restaurantResponse.data.data);
        
        // Fetch restaurant's food items
        const foodItemsResponse = await api.get(`/api/restaurants/${id}/food-items`);
        setFoodItems(foodItemsResponse.data.data);
        setFilteredItems(foodItemsResponse.data.data);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(foodItemsResponse.data.data.map(item => item.category))];
        setCategories(uniqueCategories);
        
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndItems();
  }, [id]);

  useEffect(() => {
    // Filter food items based on search term and category
    let filtered = [...foodItems];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, foodItems]);

  const handleAddToCart = (item) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      restaurantId: id,
      restaurantName: restaurant?.name || '',
      image: item.imageUrl,
      quantity: 1
    });
  };

  const handleItemQuantityChange = (item, delta) => {
    // Find if item is already in cart
    const cartItem = cart.items.find(cartItem => cartItem._id === item._id);
    
    if (cartItem) {
      const newQuantity = cartItem.quantity + delta;
      if (newQuantity <= 0) {
        // Remove item if quantity becomes zero
        updateItemQuantity(item._id, 0);
      } else {
        updateItemQuantity(item._id, newQuantity);
      }
    } else if (delta > 0) {
      // Add new item to cart
      handleAddToCart(item);
    }
  };
  
  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.items.find(item => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  
  const handleGoBack = () => {
    navigate('/customer');
  };

  // Skeleton loaders
  const RestaurantSkeleton = () => (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Skeleton variant="rectangular" width="100%" height={250} />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" height={40} width="60%" />
        <Skeleton variant="text" height={24} width="40%" />
        <Box sx={{ display: 'flex', mt: 1 }}>
          <Skeleton variant="text" height={24} width={150} sx={{ mr: 2 }} />
          <Skeleton variant="text" height={24} width={150} />
        </Box>
      </Box>
    </Box>
  );

  const FoodItemSkeleton = () => (
    <Card sx={{ display: 'flex', mb: 2, height: 140 }}>
      <Skeleton variant="rectangular" width={140} height={140} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
        <Skeleton variant="text" height={28} width="50%" />
        <Skeleton variant="text" height={20} width="30%" />
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" height={24} width={80} />
          <Skeleton variant="rectangular" height={36} width={100} />
        </Box>
      </Box>
    </Card>
  );

  return (
    <CustomerLayout>
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ position: 'absolute', top: 0, left: 0, zIndex: 2, color: 'white', mt: 2, ml: 2 }}
        >
          Back
        </Button>
        
        {loading ? (
          <RestaurantSkeleton />
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : restaurant ? (
          <>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Box
                sx={{
                  height: 250,
                  backgroundImage: `url(${restaurant.imageUrl || "https://cdn-icons-png.flaticon.com/512/4039/4039232.png"})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    borderRadius: 2,
                  }
                }}
              />
              
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, color: 'white' }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  {restaurant.name}
                </Typography>
                <Typography variant="subtitle1">
                  {restaurant.cuisine}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="body1">
                    {restaurant.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <LocationOnIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {restaurant.address}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {restaurant.operatingHours || "10:00 AM - 10:00 PM"}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating 
                        value={restaurant.rating || 4.5}
                        precision={0.5}
                        readOnly
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {restaurant.rating || 4.5} ({restaurant.ratingCount || '120'} reviews)
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        Estimated delivery time
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        30-45 min
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">
                        Delivery fee
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        $2.99
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h5" gutterBottom>
              Menu
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search menu items..."
                size="small"
                sx={{ mb: 2 }}
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
              
              <Paper sx={{ mb: 3 }}>
                <Tabs
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {categories.map((category) => (
                    <Tab 
                      key={category} 
                      label={category === 'all' ? 'All Items' : category} 
                      value={category}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Tabs>
              </Paper>
            </Box>
            
            {filteredItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No items found matching your criteria.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredItems.map((item) => {
                  const itemQuantity = getItemQuantityInCart(item._id);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={item.imageUrl || "https://via.placeholder.com/300x200?text=Food+Item"}
                          alt={item.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.description || "Delicious food item from our menu"}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              ${item.price?.toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          {itemQuantity > 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleItemQuantityChange(item, -1)}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography variant="body1" fontWeight={600}>
                                {itemQuantity}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => handleItemQuantityChange(item, 1)}
                                color="primary"
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button 
                              fullWidth 
                              variant="contained" 
                              color="primary"
                              startIcon={<AddIcon />}
                              onClick={() => handleAddToCart(item)}
                            >
                              Add to cart
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        ) : (
          <Alert severity="info">
            Restaurant not found.
          </Alert>
        )}
      </Box>
    </CustomerLayout>
  );
};

export default RestaurantDetails;