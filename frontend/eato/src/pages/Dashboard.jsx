import React, { useEffect, useState } from 'react';
import { getAssignedDeliveries, updateDeliveryStatus } from '../services/api';
import DeliveryList from '../components/DeliveryList';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #f0f4f8, #e8f5e9)',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    background: '#fff',
    padding: '35px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '26px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  label: {
    fontWeight: '500',
    marginRight: '10px',
    color: '#34495e',
  },
  input: {
    padding: '10px 12px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    fontSize: '14px',
    width: '200px',
    marginRight: '10px',
  },
  button: {
    padding: '10px 18px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '15px',
  },
  driverIdText: {
    fontWeight: '500',
    color: '#2d3436',
    marginBottom: '15px',
    textAlign: 'center',
  },
  form: {
    textAlign: 'center',
    marginBottom: '30px',
  },
};

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState('');
  const [driverId, setDriverId] = useState('');
  const [searchDriverId, setSearchDriverId] = useState('');
  const [hover, setHover] = useState(false);

  const fetchDeliveries = async (driverIdToFetch) => {
    try {
      const data = await getAssignedDeliveries(driverIdToFetch || driverId);
      setDeliveries(data);

      if (!driverIdToFetch) {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setDriverId(decoded.id);
        }
      }
    } catch (err) {
      setError('Failed to load deliveries');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchDriverId) {
      fetchDeliveries(searchDriverId);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateDeliveryStatus(orderId, status);
      fetchDeliveries();
    } catch {
      setError('Failed to update delivery status');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.header}>🚗 Driver Dashboard</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form style={styles.form} onSubmit={handleSearch}>
          <label style={styles.label}>Search Driver ID:</label>
          <input
            type="text"
            value={searchDriverId}
            onChange={(e) => setSearchDriverId(e.target.value)}
            style={styles.input}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(hover ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Search
          </button>
        </form>
        <DeliveryList deliveries={deliveries} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default Dashboard;
