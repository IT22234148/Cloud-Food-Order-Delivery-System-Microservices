import React, { useState, useEffect } from 'react';
import { assignDelivery } from '../services/api';

const AssignDeliveries = () => {
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [orderLocation, setOrderLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div style={{ ...styles.page, flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Left Panel with Image */}
      <div style={{ ...styles.leftPanel, height: isMobile ? '30vh' : '100vh' }}>
        <img
          src="/Delivery.jpg"
          alt="Delivery Visual"
          style={isMobile ? styles.imageMobile : styles.image}
        />
      </div>

      {/* Right Panel with Form */}
      <div style={styles.rightPanel}>
        <div style={styles.container}>
          <h2 style={styles.title}>🚚 Assign Deliveries</h2>
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
                placeholder="Enter Order ID"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Customer ID:</label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                style={styles.input}
                placeholder="Enter Customer ID"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pickup Location:</label>
              <input
                type="text"
                value={orderLocation}
                onChange={(e) => setOrderLocation(e.target.value)}
                style={styles.input}
                placeholder="Enter Pickup Location"
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
              🚀 Assign Delivery
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ORANGE = '#FF4F00';
const DARKER_ORANGE = '#e04800';

const styles = {
  page: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
    background: 'linear-gradient(135deg, #f9f9f9, #ffe8d6)',
    overflow: 'hidden',
    animation: 'fadeIn 1s ease-in-out',
  },
  leftPanel: {
    flex: 1.2,
    backgroundColor: ORANGE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  rightPanel: {
    flex: 1.4,
    background: 'linear-gradient(135deg, #ffffff, #ffeedd)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 30px',
  },
  image: {
    width: '75%',
    height: 'auto',
    borderRadius: '24px',
    objectFit: 'cover',
    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
    animation: 'popIn 1.2s ease',
  },
  imageMobile: {
    width: '80%',
    height: 'auto',
    borderRadius: '20px',
    objectFit: 'cover',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    background: '#ffffff',
    padding: '45px',
    borderRadius: '20px',
    boxShadow: '0 14px 35px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    marginBottom: '8px',
    display: 'block',
    fontWeight: '600',
    color: '#666',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '10px',
    border: `2px solid ${ORANGE}`,
    backgroundColor: '#fefefe',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  button: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: ORANGE,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 5px 15px rgba(255,79,0,0.4)',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: DARKER_ORANGE,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(224,72,0,0.5)',
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: '20px',
    fontSize: '16px',
  },
  error: {
    color: '#e74c3c',
  },
  success: {
    color: '#27ae60',
  },
};

export default AssignDeliveries;
