import React, { useState } from 'react';
import { assignDelivery } from '../services/api';

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #e0f7fa, #fffde7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '550px',
    padding: '35px',
    borderRadius: '16px',
    background: '#ffffff',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '26px',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#34495e',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #ccc',
    fontSize: '15px',
    transition: 'border 0.3s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#3498db',
  },
  button: {
    marginTop: '15px',
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
  message: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: '500',
  },
  error: {
    color: '#e74c3c',
  },
  success: {
    color: '#2ecc71',
  },
};

const AssignDeliveries = () => {
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [orderLocation, setOrderLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hover, setHover] = useState(false);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      if (!orderId || !customerId || !orderLocation) {
        setError('All fields are required');
        setSuccess('');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No auth token found');
        setSuccess('');
        return;
      }

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const driverId = decoded.id;

      await assignDelivery(orderId, driverId, customerId, orderLocation);

      const notificationResponse = await fetch('http://localhost:5003/notify/driver-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decoded.email,
          phone: decoded.phone,
          orderId,
          pickupLocation: orderLocation,
        }),
      });

      if (!notificationResponse.ok) {
        const errorData = await notificationResponse.json();
        throw new Error(errorData.error || 'Failed to send notification');
      }

      setSuccess('🚚 Delivery assigned successfully!');
      setError('');
      setOrderId('');
      setCustomerId('');
      setOrderLocation('');
    } catch (error) {
      console.error('Error:', error.message);
      setError(`❌ ${error.message}`);
      setSuccess('');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Assign Deliveries</h2>
        {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
        {success && <p style={{ ...styles.message, ...styles.success }}>{success}</p>}
        <form onSubmit={handleAssign}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Order ID:</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer ID:</label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Order Location:</label>
            <input
              type="text"
              value={orderLocation}
              onChange={(e) => setOrderLocation(e.target.value)}
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(hover ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Assign Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignDeliveries;
