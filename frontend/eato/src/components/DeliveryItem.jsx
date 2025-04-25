import React, { useState } from 'react';

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    fontFamily: "'Segoe UI', sans-serif",
    transition: 'transform 0.2s ease',
  },
  cardHover: {
    transform: 'scale(1.02)',
  },
  text: {
    fontSize: '15px',
    marginBottom: '8px',
    color: '#2d3436',
  },
  bold: {
    fontWeight: '600',
  },
  button: {
    marginTop: '10px',
    padding: '10px 16px',
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
};

const DeliveryItem = ({ delivery, onStatusChange }) => {
  const { orderId, status, currentLocation } = delivery;
  const [isHovered, setIsHovered] = useState(false);

  const nextStatus = {
    Assigned: 'In_transit',
    In_transit: 'Delivered',
  };

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p style={styles.text}>
        <span style={styles.bold}>Order ID:</span> {orderId}
      </p>
      <p style={styles.text}>
        <span style={styles.bold}>Status:</span> {status ? status.replace('_', ' ') : 'Unknown'}
      </p>
      {currentLocation && (
        <p style={styles.text}>
          <span style={styles.bold}>Current Location:</span> {currentLocation}
        </p>
      )}
      {status && status !== 'Delivered' && (
        <button
          onClick={() => onStatusChange(orderId, nextStatus[status])}
          style={{
            ...styles.button,
            ...(isHovered ? styles.buttonHover : {}),
          }}
        >
          Mark as {nextStatus[status]?.replace('_', ' ') || 'Unknown'}
        </button>
      )}
    </div>
  );
};

export default DeliveryItem;
