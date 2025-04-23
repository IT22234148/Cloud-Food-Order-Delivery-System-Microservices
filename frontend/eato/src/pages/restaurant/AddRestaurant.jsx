import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisine: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { auth, user } = useAuth();

  if (!auth || user?.role !== 'restaurant') {
    return <div>Unauthorized to access this page.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/restaurants', formData);
      setMessage('Restaurant added successfully!');
      navigate('/restaurant/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add restaurant.');
    }
  };

  return (
    <div>
      <h2>Add New Restaurant</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cuisine">Cuisine:</label>
          <input
            type="text"
            id="cuisine"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Restaurant</button>
      </form>
      <Link to="/restaurant/dashboard">Back to Dashboard</Link>
    </div>
  );
}

export default AddRestaurant;
