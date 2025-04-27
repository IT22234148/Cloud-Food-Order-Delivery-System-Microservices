import React, { useState } from 'react';
import API from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AddMenuItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
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
      await API.post('/menuitems', formData);
      setMessage('Menu item added successfully!');
      navigate('/restaurant/dashboard/menu'); // Redirect to manage menu items
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add menu item.');
    }
  };

  return (
    <div>
      <h2>Add New Menu Item</h2>
      {message && <p>{message}</p>}
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
        <button type="submit">Add Menu Item</button>
      </form>
      <Link to="/restaurant/dashboard/menu">Back to Manage Menu</Link>
    </div>
  );
}

export default AddMenuItem;
