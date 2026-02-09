import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '3D Globe' },
    { path: '/dashboard', label: 'Dashboard'},
    { path: '/satellites', label: 'Satellites' },
    { path: '/schedule', label: 'Schedule'},
    { path: '/analytics', label: 'Analytics'}
  ];

  return (
    <nav style={navStyle}>
      <div style={brandStyle}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <span style={logoStyle}>🌟</span>
          <div style={lightBeamStyle}></div>
          <div style={satelliteStyle}>🛰️</div>
        </div>
        <h2 style={titleStyle}>Astraeus</h2>
      </div>
      <div style={linksStyle}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...linkStyle,
              ...(location.pathname === item.path ? activeLinkStyle : {})
            }}>
            <span style={{marginRight: '0.5rem'}}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const navStyle = {
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%)',
  padding: '1.5rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  position: 'relative',
  overflow: 'hidden'
};

const logoStyle = {
  fontSize: '32px',
  filter: 'drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ff6b6b) drop-shadow(0 0 60px #48dbfb)',
  animation: 'star-emit-light 4s ease-in-out infinite',
  textShadow: '0 0 30px #ffd700, 0 0 60px #ff6b6b, 0 0 90px #48dbfb',
  position: 'relative',
  zIndex: 2
};

const linksStyle = {
  display: 'flex',
  gap: '1rem'
};

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '25px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'linear-gradient(135deg, #1d244427 0%, #29193932 100%)',
  border: '2px solid transparent',
  boxShadow: '0 8px 32px rgba(24, 29, 53, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  fontWeight: '600',
  fontSize: '14px',
  letterSpacing: '0.5px',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  overflow: 'hidden'
};

const activeLinkStyle = {
  background: 'linear-gradient(135deg, #831919ca 0%, #a27b269f 50%, #48dafb77 100%)',
  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  transform: 'translateY(-2px) scale(1.05)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  animation: 'glow 2s ease-in-out infinite alternate'
};

const titleStyle = {
  margin: 0,
  color: '#ffffff',
  background: 'linear-gradient(90deg, #ffd700 50%, #ff6b6b 70%, #48dbfb 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'text-reveal 4s ease-in-out infinite',
  position: 'relative'
};

const lightBeamStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '200px',
  height: '2px',
  background: 'linear-gradient(90deg, #ffd700, transparent)',
  animation: 'light-beam 4s ease-in-out infinite',
  transform: 'translate(-50%, -50%)',
  transformOrigin: 'left center',
  borderRadius: '50px',
  boxShadow: '0 0 10px #ffd700, 0 0 20px #ffd700',
  zIndex: 1
};

const satelliteStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  fontSize: '12px',
  animation: 'satellite-journey 8s ease-in-out infinite',
  transform: 'translate(-50%, -50%)',
  zIndex: 3,
  filter: 'drop-shadow(0 0 5px #48dbfb)'
};

const iconStyle = {
  fontSize: '16px'
};

export default Navigation;