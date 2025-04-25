// src/pages/CustomerRestaurantList.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api';


const CustomerRestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/api/restaurants/customer/all'); // Your backend endpoint
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to fetch restaurants.');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Explore Restaurants</h1>
      <ul>
        {restaurants.map(restaurant => (
          <li key={restaurant._id}>
            <h2>{restaurant.name}</h2>
            <p>Owner ID: {restaurant.ownerId}</p> {/* Display the owner's ID */}
            <p>Address: {restaurant.address}</p>
            {restaurant.contactNumber && <p>Contact: {restaurant.contactNumber}</p>}
            <p>Availability: {restaurant.isAvailable ? 'Open' : 'Closed'}</p>
            <p>Created At: {new Date(restaurant.createdAt).toLocaleDateString()}</p>
            <p>Updated At: {new Date(restaurant.updatedAt).toLocaleDateString()}</p>
            {/* You can add a Link to a restaurant details page if needed */}
            {/* <Link to={`/restaurant/${restaurant._id}`}>View Details</Link> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerRestaurantList;