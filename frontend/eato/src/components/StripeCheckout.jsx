import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { jwtDecode } from 'jwt-decode';

const stripePromise = loadStripe('pk_test_51Q8MeRRq87H6ul5NCn0Cv5v7vNptuZzndXYhNFKCiwIZDZkyO7GozjBapuzbGOj5cigIqWEHrv6D6oDjKPEMACxE00J6iMPHN8'); // replace with your Stripe public key

const PaymentForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from JWT
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserName(decoded.email || 'User');
    }

    const fetchClientSecret = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5002/api/payment/card',
          { orderId, amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setMessage('Failed to initiate payment.');
        console.error(err);
      }
    };

    fetchClientSecret();
  }, [orderId, amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(`Payment failed: ${result.error.message}`);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setMessage('🎉 Payment successful!');
        await axios.post(
          'http://localhost:5002/api/payment/confirm',
          { paymentIntentId: result.paymentIntent.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Hello, {userName} 👋</h2>
        <p style={styles.subtitle}>You're paying <span style={styles.amount}>LKR {amount}</span> for your order</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputBox}>
            <CardElement />
          </div>

          <button type="submit" style={styles.button} disabled={!stripe || !clientSecret}>
            Pay Securely
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const StripeCheckout = ({ orderId, amount }) => (
  <Elements stripe={stripePromise}>
    <PaymentForm orderId={orderId} amount={amount} />
  </Elements>
);

export default StripeCheckout;

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa, #e0e0ff)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '0.5rem',
    fontSize: '1.6rem',
    color: '#333',
  },
  subtitle: {
    marginBottom: '1.5rem',
    fontSize: '1rem',
    color: '#666',
  },
  amount: {
    color: '#6c63ff',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputBox: {
    border: '1px solid #ddd',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
  },
  button: {
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6c63ff',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  message: {
    marginTop: '1rem',
    color: '#28a745',
    fontWeight: 'bold',
  },
};
