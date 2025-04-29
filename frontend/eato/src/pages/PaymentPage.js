import React, { useState } from 'react';
import CashOnDelivery from './CashOnDelivery';
import StripeCheckout from '../components/StripeCheckout';

const PaymentPage = ({ orderId, amount }) => {
  const [paymentMethod, setPaymentMethod] = useState(null); // null, 'card', or 'cod'

  const handleSelectMethod = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div style={styles.wrapper}>
      {!paymentMethod ? (
        <div style={styles.methodSelection}>
          <h2 style={styles.title}>Select Payment Method</h2>
          <div style={styles.buttons}>
            <button style={styles.cardButton} onClick={() => handleSelectMethod('card')}>
              Pay by Card
            </button>
            <button style={styles.codButton} onClick={() => handleSelectMethod('cod')}>
              Pay by Cash
            </button>
          </div>
        </div>
      ) : paymentMethod === 'card' ? (
        <StripeCheckout orderId={orderId} amount={amount} />
      ) : (
        <CashOnDelivery orderId={orderId} amount={amount} />
      )}
    </div>
  );
};

export default PaymentPage;

// Internal CSS styles
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#ECE7DA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '2rem',
  },
  methodSelection: {
    background: '#fff',
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '2px solid #b3c7ff',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '2rem',
    color: '#333',
  },
  buttons: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
  },
  cardButton: {
    padding: '1rem 2rem',
    backgroundColor: '#FF4F00',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  codButton: {
    padding: '1rem 2rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};
