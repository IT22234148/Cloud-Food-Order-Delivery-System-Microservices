import React, { useEffect, useState } from 'react';
import { getAssignedDeliveries, updateDeliveryStatus } from '../services/api';
import DeliveryList from '../components/DeliveryList';

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState('');
  const [driverId, setDriverId] = useState('');
  const [searchDriverId, setSearchDriverId] = useState('');
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    setFadeIn(true); // Trigger fade-in animation
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDeliveries = async (driverIdToFetch) => {
    try {
      const data = await getAssignedDeliveries(driverIdToFetch || driverId);
      setDeliveries(data);

      if (!driverIdToFetch) {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setDriverId(decoded.id);
        }
      }
    } catch (err) {
      setError('Failed to load deliveries');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchDriverId) {
      fetchDeliveries(searchDriverId);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateDeliveryStatus(orderId, status);
      fetchDeliveries();
    } catch {
      setError('Failed to update delivery status');
    }
  };

  return (
    <div style={{ ...styles.page, flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Left Panel */}
      <div style={{ ...styles.leftPanel, height: isMobile ? '30vh' : '100vh' }}>
        <img
          src="/driver.jpg" // Replace with your real image path
          alt="Driver Dashboard"
          style={isMobile ? styles.imageMobile : styles.image}
        />
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div
          style={{
            ...styles.container,
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease',
          }}
        >
          <h2 style={styles.title}>🚗 Driver Dashboard</h2>
          {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}

          <form style={{ ...styles.form, marginBottom: '20px' }} onSubmit={handleSearch}>
            <label style={{ ...styles.label, marginBottom: '10px' }} htmlFor="driverIdInput">
              Search Driver ID:
            </label>
            <div style={styles.formGroup}>
              <input
                id="driverIdInput"
                type="text"
                value={searchDriverId}
                onChange={(e) => setSearchDriverId(e.target.value)}
                style={styles.input}
                placeholder="Enter Driver ID"
              />
            </div>
            <button
              type="submit"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                ...styles.button,
                ...(hover ? styles.buttonHover : {}),
              }}
            >
              Search
            </button>
          </form>

          {/* Deliveries List */}
          <DeliveryList deliveries={deliveries} onStatusChange={handleStatusChange} />
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
  form: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px', // Add bottom margin to the form group
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
};

export default Dashboard;
