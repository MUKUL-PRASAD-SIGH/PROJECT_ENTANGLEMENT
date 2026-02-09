/**
 * Live Communication Windows Component
 * Displays real-time communication opportunities between satellites and ground stations
 */

import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const LiveCommunicationWindows = () => {
  const [windows, setWindows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load communication windows
  const loadWindows = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const windowsData = await ApiService.getCommunicationWindows({
        duration_hours: 6,  // Next 6 hours
        min_elevation: 10   // Minimum 10° elevation
      });
      
      // Remove duplicates based on satellite, station, and start time
      const uniqueWindows = (windowsData.windows || []).filter((window, index, arr) => {
        return index === arr.findIndex(w => 
          w.satellite === window.satellite &&
          w.station === window.station &&
          w.start_time === window.start_time
        );
      });
      
      setWindows(uniqueWindows);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error loading communication windows:', error);
      setError('Failed to load communication windows');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data
    loadWindows();

    // Set up auto-refresh if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadWindows, 60000); // Refresh every minute
    }

    // Try to connect to WebSocket for real-time updates
    const setupWebSocket = async () => {
      try {
        if (!ApiService.isWebSocketConnected()) {
          await ApiService.connectWebSocket();
        }
        
        // WebSocket subscription would go here when implemented
        console.log('WebSocket connected for communication windows');
      } catch (error) {
        console.error('WebSocket setup failed for windows:', error);
      }
    };

    setupWebSocket();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  const getWindowStatus = (window) => {
    const now = new Date();
    const start = new Date(window.start_time);
    const end = new Date(window.end_time);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'past';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'upcoming': return '#FF9800';
      case 'past': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const getQualityColor = (score) => {
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.6) return '#FF9800';
    return '#F44336';
  };

  const categorized = {
    past: windows.filter(w => getWindowStatus(w) === 'past'),
    live: windows.filter(w => getWindowStatus(w) === 'active'),
    upcoming: windows.filter(w => getWindowStatus(w) === 'upcoming')
  };

  const Section = ({ title, items, emptyText, barClass }) => (
    <div className={`windows-section ${barClass}`}>
      <div className="section-header">
        <h4>{title}</h4>
        <span className="count-badge">{items.length}</span>
      </div>
      <div className="windows-grid">
        {items.length > 0 ? (
          items.map((window, index) => {
            const status = getWindowStatus(window);
            const startTime = new Date(window.start_time);
            const endTime = new Date(window.end_time);

            return (
              <div key={index} className={`window-card status-${status}`}>
                <div className="window-header">
                  <h4>{window.satellite || window.satellite_name} ↔ {window.station || window.ground_station}</h4>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    {status.toUpperCase()}
                  </div>
                </div>
                <div className="window-details">
                  <div className="time-info">
                    <p> Start: {startTime.toLocaleTimeString()}</p>
                    <p> End: {endTime.toLocaleTimeString()}</p>
                    <p> Duration: {formatDuration(window.duration_minutes)}</p>
                  </div>
                  <div className="technical-info">
                    <p> Max Elevation: {(window.max_elevation_degrees || window.max_elevation || 0).toFixed(1)}°</p>
                    <p> Quality:
                      <span 
                        style={{ 
                          color: getQualityColor(window.quality_score || 0),
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}
                      >
                        {((window.quality_score || 0) * 100).toFixed(0)}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data">{emptyText}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="live-communication-windows">
      <div className="windows-header">
        <h3>📡 Communication Windows</h3>
        <div className="windows-controls">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <button 
            className="btn btn-small" 
            onClick={loadWindows}
            disabled={isLoading}
          >
            {isLoading ? ' Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
           {error}
        </div>
      )}

      {lastUpdate && (
        <div className="last-update">
          📅 Last Update: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      <Section 
        title="Past Communication Windows"
        items={categorized.past}
        emptyText={isLoading ? 'Loading...' : 'No past windows in range'}
        barClass="bar-past"
      />

      <Section 
        title="Live Communication Windows"
        items={categorized.live}
        emptyText={isLoading ? 'Loading...' : 'No active windows right now'}
        barClass="bar-live"
      />

      <Section 
        title="Upcoming Communication Windows"
        items={categorized.upcoming}
        emptyText={isLoading ? 'Loading...' : 'No upcoming windows found'}
        barClass="bar-upcoming"
      />

      {windows.length > 0 && (
        <div className="windows-summary">
          <p> Found {windows.length} communication window{windows.length !== 1 ? 's' : ''}</p>
          <p> Next 6 hours • Min elevation: 10°</p>
        </div>
      )}
    </div>
  );
};

export default LiveCommunicationWindows;
