import React from 'react';

const MobileLandingPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
    <h1>📱 Americanstruction App</h1>
    <p>Select an option to get started:</p>
    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <a href="/login" style={linkStyle}>🔐 Login</a>
      <a href="/create-account" style={linkStyle}>📝 Create Account</a>
      <a href="/inspection" style={linkStyle}>📋 Start Inspection</a>
      <a href="/revisit" style={linkStyle}>📁 Revisit Inspections</a>
    </div>
  </div>
);

const linkStyle = {
  display: 'block',
  padding: '1rem',
  backgroundColor: '#111',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '8px',
};

export default MobileLandingPage;
