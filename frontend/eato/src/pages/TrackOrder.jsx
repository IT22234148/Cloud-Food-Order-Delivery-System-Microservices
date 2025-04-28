import React, { useState, useEffect } from 'react';
import { getOrderStatus } from '../services/api';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isHover, setIsHover] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    setFadeIn(true); // Trigger fade-in animation
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTrack = async () => {
    try {
      if (!orderId.trim()) {
        setError('Please enter an Order ID');
        setOrder(null);
        return;
      }
      const data = await getOrderStatus(orderId);
      setOrder(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch order');
      setOrder(null);
    }
  };

  return (
    <div style={{ ...styles.page, flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Left Panel */}
      <div style={{ ...styles.leftPanel, height: isMobile ? '30vh' : '100vh' }}>
        <img
          src="/track.jpg" // Replace with your real image path
          alt="Track Your Order"
          style={isMobile ? styles.imageMobile : styles.image}
        />
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={{
          ...styles.container,
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>
          <h2 style={styles.title}>📦 Track Your Order</h2>
          {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Order ID:</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID"
              style={styles.input}
            />
          </div>
          <button
            onClick={handleTrack}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
              ...styles.button,
              ...(isHover ? styles.buttonHover : {})
            }}
          >
            Track
          </button>

          {order && (
            <div style={styles.orderInfo}>
              <h3 style={styles.orderHeading}>Order Details</h3>
              <p style={styles.orderText}><strong>Status:</strong> {order.status}</p>
              <p style={styles.orderText}><strong>Driver ID:</strong> {order.driverId}</p>
              {order.currentLocation && (
                <p style={styles.orderText}><strong>Location:</strong> {order.currentLocation}</p>
              )}
            </div>
          )}
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
    fontFamily: "'Segoe UI', sans-serif",
    background: 'linear-gradient(135deg, #ffe0cc, #fffaf5)',
  },
  leftPanel: {
    flex: 0.5,
    backgroundColor: ORANGE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fefefe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  image: {
    width: '80%',
    height: 'auto',
    borderRadius: '20px',
    objectFit: 'cover',
    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
  },
  imageMobile: {
    width: '70%',
    height: 'auto',
    borderRadius: '16px',
    objectFit: 'cover',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
  container: {
    width: '100%',
    maxWidth: '550px',
    background: '#ffffff',
    padding: '45px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    marginBottom: '10px',
    display: 'block',
    fontWeight: '600',
    fontSize: '18px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '16px 16px',
    fontSize: '16px',
    borderRadius: '10px',
    border: `2px solid ${ORANGE}`,
    backgroundColor: '#fefefe',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    outline: 'none',

  },
  button: {
    marginTop: '14px',
    padding: '18px',
    backgroundColor: ORANGE,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    width: '100%',
  },
  buttonHover: {
    backgroundColor: DARKER_ORANGE,
    transform: 'scale(1.02)',
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
  orderInfo: {
    marginTop: '30px',
    padding: '25px',
    backgroundColor: '#f9f9fb',
    border: `2px solid ${ORANGE}`,
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  orderHeading: {
    marginBottom: '15px',
    fontSize: '24px',
    textAlign: 'center',
    color: ORANGE,
    fontWeight: '600',
  },
  orderText: {
    margin: '10px 0',
    fontSize: '18px',
    color: '#555',
  },
};

export default TrackOrder;
