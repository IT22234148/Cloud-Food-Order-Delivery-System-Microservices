import React from 'react';
import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Unauthorized</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>You do not have permission to access this page.</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '1em' }}>Go back to the homepage</Link>
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#6c757d' }}>If you believe this is an error, please contact support.</p>
    </div>
  );
}

export default UnauthorizedPage;