import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useParams } from 'react-router-dom';

function MenuItemList() {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get(`/menuitems/restaurant/${restaurantId}`);
        setMenuItems(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch menu items for this restaurant.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Menu</h2>
      {menuItems.length > 0 ? (
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              {item.name} - ${item.price} - {item.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items available for this restaurant.</p>
      )}
    </div>
  );
}

export default MenuItemList;
