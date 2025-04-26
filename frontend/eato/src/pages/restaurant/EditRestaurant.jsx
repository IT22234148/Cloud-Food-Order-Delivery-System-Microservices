import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function EditRestaurant() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisine: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { auth, user } = useAuth();

  // Always call useEffect at the top level, regardless of conditions
  useEffect(() => {
    if (!auth || user?.role !== 'restaurant') {
      return; // Early return if unauthorized, but still run the useEffect
    }

    const fetchRestaurant = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get(`/restaurants/${id}`);
        setFormData({
          name: response.data.name || '',
          address: response.data.address || '',
          cuisine: response.data.cuisine || '',
        });
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          'Failed to fetch restaurant details. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, auth, user]);

  if (!auth || user?.role !== 'restaurant') {
    return <div>Unauthorized to access this page.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/restaurants/${id}`, formData);
      setMessage('Restaurant updated successfully!');
      navigate('/restaurant/dashboard');
    } catch (err) {
      setMessage(
        err?.response?.data?.message || 'Failed to update restaurant. Please try again.'
      );
    }
  };

  if (loading) {
    return <div>Loading restaurant details...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Edit Restaurant</h2>
      {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
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
        <button type="submit">Update Restaurant</button>
      </form>
      <Link to="/restaurant/dashboard">Back to Dashboard</Link>
    </div>
  );
}

export default EditRestaurant;
