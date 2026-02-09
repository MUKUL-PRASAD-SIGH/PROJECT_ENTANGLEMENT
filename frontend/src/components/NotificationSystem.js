import React, { useState, useEffect } from 'react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);


  // Listen for custom notification events
  useEffect(() => {
    const handleNotification = (event) => {
      const { type, title, message, duration = 5000 } = event.detail;
      addNotification(type, title, message, duration);
    };

    window.addEventListener('show-notification', handleNotification);
    return () => window.removeEventListener('show-notification', handleNotification);
  }, []);

  const addNotification = (type, title, message, duration) => {
    const id = Date.now() + Math.random();
    const notification = { id, type, title, message };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '1rem 1.5rem',
      margin: '0.5rem 0',
      borderRadius: '8px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: '350px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      animation: 'slideIn 0.3s ease-out'
    };

    const typeStyles = {
      success: { background: 'linear-gradient(135deg, #10B981, #059669)', borderLeft: '4px solid #34D399' },
      error: { background: 'linear-gradient(135deg, #EF4444, #DC2626)', borderLeft: '4px solid #F87171' },
      warning: { background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderLeft: '4px solid #FBBF24' },
      info: { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderLeft: '4px solid #60A5FA' }
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  if (notifications.length === 0) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={containerStyle}>
        {notifications.map(notification => (
          <div key={notification.id} style={getNotificationStyle(notification.type)}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span style={{marginRight: '0.8rem', fontSize: '1.2rem'}}>
                {getIcon(notification.type)}
              </span>
              <div>
                <div style={{fontWeight: 'bold', fontSize: '0.95rem'}}>
                  {notification.title}
                </div>
                <div style={{fontSize: '0.85rem', opacity: 0.9}}>
                  {notification.message}
                </div>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              style={closeButtonStyle}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

const containerStyle = {
  position: 'fixed',
  top: '2rem',
  right: '2rem',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '1.5rem',
  cursor: 'pointer',
  padding: '0',
  marginLeft: '1rem',
  opacity: 0.7,
  transition: 'opacity 0.2s',
  fontFamily: "'Orbitron', monospace",
  fontWeight: '600'
};

// Helper function to show notifications
export const showNotification = (type, title, message, duration = 5000) => {
  const event = new CustomEvent('show-notification', {
    detail: { type, title, message, duration }
  });
  window.dispatchEvent(event);
};
export default NotificationSystem;