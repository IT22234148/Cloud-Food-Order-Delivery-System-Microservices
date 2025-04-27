import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

function ManageMenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { auth, user } = useAuth();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get('/menuitems/owner/all');
        setMenuItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch menu items.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'restaurant') {
      fetchMenuItems();
    } else {
      setError('Unauthorized to view this page.');
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await API.delete(`/menuitems/${id}`);
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete menu item.');
      }
    }
  };

  if (loading) {
    return <div>Loading menu items...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Manage Menu Items</h2>
      <Link to="/menu/add">Add New Menu Item</Link>
      {menuItems.length > 0 ? (
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              {item.name} - ${item.price} - Category: {item.category}
              <Link to={`/menu/edit/${item._id}`}>Edit</Link>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items added yet.</p>
      )}
      <Link to="/restaurant/dashboard">Back to Restaurant Dashboard</Link>
    </div>
  );
}

export default ManageMenuItems;
