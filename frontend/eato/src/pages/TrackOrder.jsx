import React, { useState } from 'react';
import { getOrderStatus } from '../services/api';

const styles = {
  container: {
    maxWidth: '500px',
    margin: '60px auto',
    padding: '30px',
    borderRadius: '12px',
    background: '#f9f9fb',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border 0.3s',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  buttonHover: {
    backgroundColor: '#357ab8',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '15px',
  },
  orderInfo: {
    padding: '15px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  orderText: {
    margin: '10px 0',
  },
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isHover, setIsHover] = useState(false);

  const handleTrack = async () => {
    try {
      const data = await getOrderStatus(orderId);
      setOrder(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setOrder(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Track Your Order</h2>
      <div style={styles.inputGroup}>
        <input
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          style={styles.input}
        />
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
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
      {order && (
        <div style={styles.orderInfo}>
          <p style={styles.orderText}><strong>Status:</strong> {order.status}</p>
          <p style={styles.orderText}><strong>Driver ID:</strong> {order.driverId}</p>
          {order.currentLocation && (
            <p style={styles.orderText}>
              <strong>Location:</strong> {order.currentLocation} 
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
