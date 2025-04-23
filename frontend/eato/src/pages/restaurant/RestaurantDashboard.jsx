import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get('/restaurants/owner');
        setRestaurants(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your restaurants.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'restaurant') {
      fetchRestaurants();
    } else {
      setError('Unauthorized to view this page.');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading your restaurants...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Your Restaurants</h2>
      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant._id}>
              {restaurant.name} - <Link to={`/restaurant/edit/${restaurant._id}`}>Edit</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't added any restaurants yet.</p>
      )}
      <Link to="/restaurant/add">Add New Restaurant</Link>
    </div>
  );
}

export default RestaurantDashboard;
