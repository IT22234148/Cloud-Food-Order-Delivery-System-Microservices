import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected to use the correct import for jwt-decode

const CashOnDelivery = ({ orderId, amount }) => {
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(''); // New state for user ID

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserName(decoded.email || 'User');
      setUserId(decoded.userId || ''); // Assuming userId is in the JWT payload
    }
  }, []);

  const handleCOD = async () => {
    try {
      await axios.post(
        'http://localhost:5002/api/payment/cod',
        { orderId, amount, userId }, // Send userId along with the payment details
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('✅ Cash on Delivery order placed successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to place Cash on Delivery order.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* Left Side */}
        <div style={styles.left}>
          <h2 style={styles.brand}><span style={{ color: '#fff' }}>Payment</span></h2>
          <h1 style={styles.amount}>LKR {amount}</h1>
          <p style={styles.userInfo}>Logged in as: {userName}</p>
        </div>

        {/* Right Side */}
        <div style={styles.right}>
          <h2 style={styles.title}>Cash on Delivery</h2>
          <p style={styles.subtitle}>You will pay by cash when your order is delivered to you 🛵</p>

          <button onClick={handleCOD} style={styles.payButton}>
            Confirm COD Order →
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </div>

      </div>
    </div>
  );
};

export default CashOnDelivery;

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#ECE7DA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  container: {
    display: 'flex',
    width: '950px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    border: '2px solid #b3c7ff',
  },
  left: {
    width: '40%',
    backgroundColor: '#FF4F00',
    padding: '2rem',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: '2rem',
    marginBottom: '2rem',
    fontWeight: 'bold',
  },
  amount: {
    fontSize: '2.8rem',
    marginBottom: '1rem',
  },
  userInfo: {
    fontSize: '1rem',
    opacity: 0.9,
  },
  right: {
    width: '60%',
    padding: '2rem 3rem',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#666',
  },
  payButton: {
    marginTop: '1rem',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#FF4F00',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  message: {
    marginTop: '1.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#28a745',
  },
};
