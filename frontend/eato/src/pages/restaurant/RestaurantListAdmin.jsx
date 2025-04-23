import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../hooks/useAuth';

function RestaurantListAdmin() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get('/restaurants/admin/all');
        setRestaurants(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch all restaurants.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAllRestaurants();
    } else {
      setError('Unauthorized to view this page.');
      setLoading(false);
    }
  }, [user]);

  const handleVerify = async (restaurantId) => {
    try {
      await API.patch(`/restaurants/admin/${restaurantId}/verify`);
      setRestaurants(restaurants.map(r =>
        r._id === restaurantId ? { ...r, isVerified: true } : r
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify restaurant.');
    }
  };

  if (loading) {
    return <div>Loading all restaurants...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>All Restaurants (Admin View)</h2>
      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant._id}>
              {restaurant.name} - Status: {restaurant.isVerified ? 'Verified' : 'Pending'}
              {!restaurant.isVerified && (
                <button onClick={() => handleVerify(restaurant._id)}>Verify</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No restaurants found.</p>
      )}
    </div>
  );
}

export default RestaurantListAdmin;
