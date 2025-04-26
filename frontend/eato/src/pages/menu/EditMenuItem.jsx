import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function EditMenuItem() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { auth, user } = useAuth();

  // useEffect must be unconditional
  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!auth || user?.role !== 'restaurant') {
        return; // skip fetching if unauthorized
      }

      setLoading(true);
      setError('');
      try {
        const response = await API.get(`/menuitems/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch menu item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id, auth, user]);

  // After hooks, you can conditionally return
  if (!auth || user?.role !== 'restaurant') {
    return <div>Unauthorized to access this page.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/menuitems/${id}`, formData);
      setMessage('Menu item updated successfully!');
      navigate('/restaurant/dashboard/menu');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update menu item.');
    }
  };

  if (loading) {
    return <div>Loading menu item details...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Edit Menu Item</h2>
      {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <button type="submit">Update Menu Item</button>
      </form>
      <Link to="/restaurant/dashboard/menu">Back to Manage Menu</Link>
    </div>
  );
}

export default EditMenuItem;
