import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const stripePromise = loadStripe('pk_test_51Q8MeRRq87H6ul5NCn0Cv5v7vNptuZzndXYhNFKCiwIZDZkyO7GozjBapuzbGOj5cigIqWEHrv6D6oDjKPEMACxE00J6iMPHN8'); // Replace with your Stripe public key

const PaymentForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
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

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (error) {
      setMessage(error.message);
    } else {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        setMessage(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
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
      <div style={styles.container}>

        {/* Left Side */}
        <div style={styles.left}>
          <h2 style={styles.brand}><span style={{ color: '#fff' }}>Your Payment</span></h2>
          <h1 style={styles.amount}>LKR {amount}</h1>
          <p style={styles.userInfo}>Logged in as: {userName}</p>
        </div>

        {/* Right Side */}
        <div style={styles.right}>
          <h2 style={styles.title}>Select Payment Method</h2>

          <div style={styles.icons}>
            <img src="https://img.icons8.com/color/48/visa.png" alt="visa" style={styles.icon} />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="mastercard" style={styles.icon} />
            <img src="https://img.icons8.com/ios-filled/48/apple-pay.png" alt="applepay" style={styles.icon} />
            <img src="https://img.icons8.com/color/48/paypal.png" alt="paypal" style={styles.icon} />
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.input}>
              <CardNumberElement options={{ style: styles.stripeInput }} />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              style={{ ...styles.input, padding: '14px' }}
              required
            />
            <div style={styles.row}>
              <div style={{ ...styles.input, width: '45%', marginRight: '10px' }}>
                <CardExpiryElement options={{ style: styles.stripeInput }} />
              </div>
              <div style={{ ...styles.input, width: '45%', marginLeft: '10px' }}>
                <CardCvcElement options={{ style: styles.stripeInput }} />
              </div>
            </div>

            <div style={styles.checkbox}>
              <input type="checkbox" id="saveCard" />
              <label htmlFor="saveCard" style={{ marginLeft: '8px', fontSize: '0.9rem' }}>Save card details for future use</label>
            </div>

            <button type="submit" style={styles.payButton}>
              Pay now →
            </button>

            {message && <p style={styles.success}>{message}</p>}
          </form>
        </div>

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

// Internal CSS styles
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
    maxWidth: '950px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
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
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
  },
  brand: {
    fontSize: '2.4rem',
    marginBottom: '1rem',
    fontWeight: '700',
  },
  amount: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  userInfo: {
    fontSize: '1.2rem',
    opacity: 0.8,
  },
  right: {
    width: '60%',
    padding: '2.5rem 3rem',
    backgroundColor: '#fff',
    borderTopRightRadius: '16px',
    borderBottomRightRadius: '16px',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    fontWeight: '600',
    color: '#333',
  },
  icons: {
    display: 'flex',
    gap: '1.2rem',
    marginBottom: '2rem',
  },
  icon: {
    width: '50px',
    objectFit: 'contain',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  input: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    padding: '14px',
    fontSize: '1rem',
    transition: 'border 0.3s',
  },
  inputFocus: {
    border: '1px solid #4e73df',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1.5rem',
  },
  stripeInput: {
    base: {
      fontSize: '16px',
      color: '#333',
      '::placeholder': {
        color: '#aaa',
      },
    },
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem',
  },
  payButton: {
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#FF4F00',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '100%',
  },
  payButtonHover: {
    backgroundColor: '#2e5bc3',
  },
  success: {
    marginTop: '1rem',
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
};

