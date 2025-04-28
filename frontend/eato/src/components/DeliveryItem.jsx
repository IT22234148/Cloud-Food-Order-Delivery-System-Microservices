import React, { useState } from 'react';

const ORANGE = '#FF4F00';
const DARKER_ORANGE = '#e04800';

const styles = {
  card: {
    backgroundColor: '#fce7e3',
    borderRadius: '16px',
    padding: '24px 28px',
    marginBottom: '22px',
    boxShadow: '0 10px 25px rgba(255, 79, 0, 0.15)',
    fontFamily: "'Poppins', sans-serif",
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    cursor: 'default',
  },
  cardHover: {
    transform: 'scale(1.03)',
    boxShadow: `0 14px 35px rgba(255, 81, 0, 0.35)`,
    cursor: 'pointer',
  },
  text: {
    fontSize: '17px',
    marginBottom: '12px',
    color: '#3e3e3e',
    lineHeight: '1.4',
  },
  bold: {
    fontWeight: '700',
    color: ORANGE,
  },
  button: {
    marginTop: '15px',
    padding: '12px 24px',
    backgroundColor: ORANGE,
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 7px 20px rgba(255, 79, 0, 0.45)',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    userSelect: 'none',
  },
  buttonHover: {
    backgroundColor: DARKER_ORANGE,
    transform: 'translateY(-3px)',
    boxShadow: `0 10px 30px rgba(224, 72, 0, 0.6)`,
  },
};

const DeliveryItem = ({ delivery, onStatusChange }) => {
  const { orderId, status, currentLocation } = delivery;
  const [isHovered, setIsHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

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
        <span style={styles.bold}>Status:</span>{' '}
        {status ? status.replace('_', ' ') : 'Unknown'}
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
            ...(btnHover ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
        >
          Mark as {nextStatus[status]?.replace('_', ' ') || 'Unknown'}
        </button>
      )}
    </div>
  );
};

export default DeliveryItem;
