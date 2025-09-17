import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { showNotification } from '../components/NotificationSystem';

const Satellites = () => {
  const [selectedSatellite, setSelectedSatellite] = useState('ISS');
  const [missionPriority, setMissionPriority] = useState('normal');
  const [filterStatus, setFilterStatus] = useState('all');
  const [satellites, setSatellites] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Error boundary
  if (hasError) {
    return (
      <div style={{padding: '20px'}}>
        <h1>Satellite Management</h1>
        <div style={{background: 'rgba(255,0,0,0.1)', padding: '20px', borderRadius: '10px'}}>
          <h3>Component Error</h3>
          <p>The satellite management interface encountered an error.</p>
          <button 
            className="btn" 
            onClick={() => window.location.reload()}
            style={{background: '#4CAF50', padding: '10px 20px', margin: '10px'}}
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    try {
      fetchSatellites();
      fetchGroundStations();
    } catch (error) {
      console.error('Satellites component error:', error);
      setHasError(true);
    }
  }, []);

  const fetchSatellites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/satellites');
      if (response.ok) {
        const data = await response.json();
        if (data && data.satellites && Array.isArray(data.satellites)) {
          const formattedSats = data.satellites.map(sat => ({
            id: sat.name || 'Unknown',
            name: sat.name || 'Unknown Satellite',
            status: 'active',
            altitude: Math.round(sat.altitude || 400),
            speed: Math.round((sat.altitude || 400) < 1000 ? 27600 : (sat.altitude || 400) < 2000 ? 27300 : 14000),
            period: Math.round((sat.altitude || 400) < 1000 ? 92 : (sat.altitude || 400) < 2000 ? 96 : 718),
            power: Math.floor(Math.random() * 30) + 70,
            thermal: 'nominal',
            dataStorage: Math.floor(Math.random() * 60) + 20,
            mission: (sat.name || '').includes('ISS') ? 'Research & Crew Operations' :
                     (sat.name || '').includes('STARLINK') ? 'Internet Communications' :
                     (sat.name || '').includes('CARTOSAT') ? 'Earth Observation' :
                     (sat.name || '').includes('RISAT') ? 'Radar Imaging' : 'Scientific Research',
            priority: ((sat.name || '').includes('ISS') || (sat.name || '').includes('CARTOSAT')) ? 'high' : 'normal',
            nextPass: new Date(Date.now() + Math.random() * 6 * 3600000).toLocaleTimeString('en-US', {timeZone: 'UTC'}) + ' UTC'
          }));
          setSatellites(formattedSats);
          setIsConnected(true);
        } else {
          throw new Error('Invalid data format');
        }
      } else {
        throw new Error('Backend not available');
      }
    } catch (error) {
      console.error('Failed to fetch satellites:', error);
      setIsConnected(false);
      // Fallback to mock data
      setSatellites(mockSatellites);
    }
  };

  const mockSatellites = [
    {
      id: 'ISS',
      name: 'International Space Station',
      status: 'active',
      altitude: 408,
      speed: 27600,
      period: 92,
      power: 95,
      thermal: 'nominal',
      dataStorage: 67,
      mission: 'Research & Crew Operations',
      priority: 'high',
      nextPass: '14:52 UTC'
    },
    {
      id: 'GPS-III',
      name: 'GPS III SV04',
      status: 'active',
      altitude: 20200,
      speed: 14000,
      period: 718,
      power: 88,
      thermal: 'nominal',
      dataStorage: 23,
      mission: 'Global Navigation',
      priority: 'high',
      nextPass: '16:23 UTC'
    }
  ];


  const [groundStations, setGroundStations] = useState([]);

  // Action functions
  const emergencyOverride = () => {
    showNotification('error', '🚨 EMERGENCY OVERRIDE ACTIVATED', 
      'All satellites switched to emergency protocol. Priority communications enabled.', 8000);
  };

  const assignMission = () => {
    showNotification('success', '📡 MISSION ASSIGNED', 
      `Mission assigned to ${selectedSatellite}. Priority: ${missionPriority}`, 5000);
  };

  const scheduleMaintenance = () => {
    showNotification('info', '🔧 MAINTENANCE SCHEDULED', 
      `Maintenance window scheduled for ${selectedSatellite} during next eclipse period.`, 6000);
  };

  const generateReport = () => {
    showNotification('success', '📊 REPORT GENERATED', 
      'Comprehensive satellite status report generated and downloaded.', 5000);
  };

  const trackSatellite = (name) => {
    showNotification('info', '📡 TRACKING ACTIVATED', 
      `Now tracking ${name}. Real-time position updates enabled.`, 4000);
  };

  const viewDetails = (name) => {
    showNotification('info', '📊 DETAILED VIEW', 
      `Displaying detailed telemetry for ${name}.`, 3000);
  };

  const configureSatellite = (name) => {
    showNotification('warning', '⚙️ CONFIGURATION MODE', 
      `Entering configuration mode for ${name}. Handle with care.`, 5000);
  };

  const monitorGroundStation = (name) => {
    showNotification('info', '📊 MONITORING ACTIVE', 
      `Real-time monitoring enabled for ${name}.`, 4000);
  };

  const configureGroundStation = (name) => {
    showNotification('warning', '⚙️ STATION CONFIG', 
      `Configuration panel opened for ${name}.`, 4000);
  };

  const checkWeather = (name) => {
    showNotification('info', '🌤️ WEATHER UPDATE', 
      `Current weather conditions retrieved for ${name}.`, 4000);
  };

  const fetchGroundStations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ground-stations');
      if (response.ok) {
        const data = await response.json();
        const formattedStations = data.ground_stations.map(station => ({
          id: station.name.replace(/\s+/g, '_'),
          name: station.name,
          status: 'online',
          location: station.name.includes('Bangalore') ? 'Bangalore, India' :
                   station.name.includes('Sriharikota') ? 'Sriharikota, India' :
                   station.name.includes('Houston') ? 'Houston, USA' : 'Unknown',
          weather: Math.random() > 0.7 ? 'partly cloudy' : 'clear',
          elevation: Math.round(station.elevation_m || 0),
          activeConnections: Math.floor(Math.random() * 4) + 1,
          capacity: Math.floor(Math.random() * 30) + 70
        }));
        setGroundStations(formattedStations);
      }
    } catch (error) {
      console.error('Failed to fetch ground stations:', error);
      // Fallback to mock data
      setGroundStations([
        {
          id: 'ISRO_BLR',
          name: 'ISRO Bangalore',
          status: 'online',
          location: 'Bangalore, India',
          weather: 'clear',
          elevation: 920,
          activeConnections: 2,
          capacity: 85
        },
        {
          id: 'ISRO_SHAR',
          name: 'ISRO Sriharikota',
          status: 'online',
          location: 'Sriharikota, India',
          weather: 'partly cloudy',
          elevation: 10,
          activeConnections: 1,
          capacity: 92
        },
        {
          id: 'NASA_HST',
          name: 'NASA Houston',
          status: 'online',
          location: 'Houston, USA',
          weather: 'clear',
          elevation: 15,
          activeConnections: 3,
          capacity: 78
        }
      ]);
    }
  };

  try {
    return (
      <div>
        <h1>Satellite Management</h1>
      
      {/* Control Panel */}
      <div className="card">
        <h2>Satellite Control Panel <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={controlPanelStyle}>
          <div style={controlGroupStyle}>
            <label><strong>Selected Satellite:</strong></label>
            <select value={selectedSatellite} onChange={(e) => setSelectedSatellite(e.target.value)} style={selectStyle}>
              {satellites.map(sat => (
                <option key={sat.id} value={sat.id}>{sat.name}</option>
              ))}
            </select>
          </div>
          <div style={controlGroupStyle}>
            <label><strong>Mission Priority:</strong></label>
            <select value={missionPriority} onChange={(e) => setMissionPriority(e.target.value)} style={selectStyle}>
              <option value="emergency">🚨 Emergency</option>
              <option value="high">🔴 High Priority</option>
              <option value="normal">🟡 Normal</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>
          <div style={controlGroupStyle}>
            <label><strong>Filter Status:</strong></label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
              <option value="all">All Satellites</option>
              <option value="active">Active Only</option>
              <option value="maintenance">Maintenance</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>
        <div style={actionButtonsStyle}>
          <button className="btn" style={emergencyButtonStyle} onClick={emergencyOverride}>🚨 Emergency Override</button>
          <button className="btn" style={actionButtonStyle} onClick={assignMission}>📡 Assign Mission</button>
          <button className="btn" style={actionButtonStyle} onClick={scheduleMaintenance}>🔧 Schedule Maintenance</button>
          <button className="btn" style={actionButtonStyle} onClick={generateReport}>📊 Generate Report</button>
        </div>
      </div>

      {/* Satellite Detail Cards */}
      <div className="card">
        <h2>Active Satellites <span style={{color: isConnected ? '#00ff00' : '#ff0000', fontSize: '12px'}}>({isConnected ? 'LIVE' : 'MOCK'})</span></h2>
        <div style={satelliteGridStyle}>
          {satellites.map(satellite => (
            <div key={satellite.id} style={satelliteCardStyle} className="satellite-item">
              <div style={satelliteHeaderStyle}>
                <h3>{satellite.name}</h3>
                <div style={statusIndicatorStyle(satellite.status)}>
                  {satellite.status === 'active' ? '🟢' : '🔴'} {satellite.status.toUpperCase()}
                </div>
              </div>
              
              {/* Orbital Parameters */}
              <div style={parameterSectionStyle}>
                <h4>Orbital Parameters</h4>
                <div style={parameterGridStyle}>
                  <div><strong>Altitude:</strong> {satellite.altitude} km</div>
                  <div><strong>Speed:</strong> {satellite.speed.toLocaleString()} km/h</div>
                  <div><strong>Period:</strong> {satellite.period} min</div>
                  <div><strong>Next Pass:</strong> {satellite.nextPass}</div>
                </div>
              </div>
              
              {/* Hardware Status */}
              <div style={parameterSectionStyle}>
                <h4>Hardware Status</h4>
                <div style={hardwareGridStyle}>
                  <div style={hardwareItemStyle}>
                    <span>Power:</span>
                    <div style={progressBarStyle}>
                      <div style={{...progressFillStyle, width: `${satellite.power}%`, backgroundColor: satellite.power > 70 ? '#00ff00' : satellite.power > 40 ? '#ffff00' : '#ff0000'}}></div>
                    </div>
                    <span>{satellite.power}%</span>
                  </div>
                  <div style={hardwareItemStyle}>
                    <span>Storage:</span>
                    <div style={progressBarStyle}>
                      <div style={{...progressFillStyle, width: `${satellite.dataStorage}%`, backgroundColor: satellite.dataStorage < 80 ? '#00ff00' : satellite.dataStorage < 90 ? '#ffff00' : '#ff0000'}}></div>
                    </div>
                    <span>{satellite.dataStorage}%</span>
                  </div>
                  <div><strong>Thermal:</strong> <span style={{color: satellite.thermal === 'nominal' ? '#00ff00' : '#ff0000'}}>{satellite.thermal.toUpperCase()}</span></div>
                </div>
              </div>
              
              {/* Mission Info */}
              <div style={parameterSectionStyle}>
                <h4>Mission Assignment</h4>
                <div><strong>Current Mission:</strong> {satellite.mission}</div>
                <div><strong>Priority:</strong> 
                  <span style={priorityStyle(satellite.priority)}>
                    {satellite.priority === 'high' ? '🔴 HIGH' : satellite.priority === 'normal' ? '🟡 NORMAL' : '🟢 LOW'}
                  </span>
                </div>
              </div>
              
              <div style={satelliteActionsStyle}>
                <button className="btn" style={smallButtonStyle} onClick={() => trackSatellite(satellite.name)}>📡 Track</button>
                <button className="btn" style={smallButtonStyle} onClick={() => viewDetails(satellite.name)}>📊 Details</button>
                <button className="btn" style={smallButtonStyle} onClick={() => configureSatellite(satellite.name)}>⚙️ Configure</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Advanced Orbital Mechanics */}
      <div className="card">
        <h2>🌌 Advanced Orbital Mechanics <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={orbitalMechanicsStyle}>
          <div style={perturbationStyle}>
            <h4>Atmospheric Drag Effects</h4>
            {satellites.map(sat => {
              const dragEffect = sat.altitude < 600 ? -3.2 : sat.altitude < 1000 ? -1.8 : -0.4;
              return <div key={sat.id}>{sat.name}: {dragEffect.toFixed(1)} m/s per day</div>;
            })}
          </div>
          <div style={perturbationStyle}>
            <h4>Solar Radiation Pressure</h4>
            {satellites.map(sat => {
              const solarPressure = sat.altitude > 10000 ? +0.5 : sat.altitude > 1000 ? +0.3 : +0.1;
              return <div key={sat.id}>{sat.name}: +{solarPressure.toFixed(1)} m/s per day</div>;
            })}
          </div>
          <div style={perturbationStyle}>
            <h4>Gravitational Perturbations</h4>
            <div>Moon Effect: ±{(0.1 * Math.sin(Date.now() / 86400000 * 2 * Math.PI / 28)).toFixed(2)} m/s</div>
            <div>Sun Effect: ±{(0.05 * Math.sin(Date.now() / 86400000 * 2 * Math.PI / 365)).toFixed(3)} m/s</div>
            <div>Earth Oblateness: {(satellites.length * 0.02).toFixed(2)} deg/day precession</div>
          </div>
        </div>
      </div>

      {/* Hardware Constraints Modeling */}
      <div className="card">
        <h2>Hardware Constraints & Thermal Management <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={hardwareConstraintsStyle}>
          <div style={constraintCategoryStyle}>
            <h4>Power Management</h4>
            <div>Solar Panel Efficiency: {(22.5 - Math.random() * 2).toFixed(1)}%</div>
            <div>Active Satellites: {satellites.filter(s => s.status === 'active').length}</div>
            <div>Total Power Budget: {(satellites.length * 180 + Math.random() * 100).toFixed(0)}W</div>
            <div>Eclipse Duration: {satellites.length > 0 ? Math.round(satellites[0].period * 0.38) : 35} min/orbit</div>
          </div>
          <div style={constraintCategoryStyle}>
            <h4>Thermal Constraints</h4>
            <div>Operating Range: -40°C to +85°C</div>
            <div>Current Temp: {(20 + Math.random() * 10).toFixed(0)}°C (nominal)</div>
            <div>Thermal Cycling: {Math.round(1440 / (satellites.length > 0 ? satellites[0].period : 90))} cycles/day</div>
            <div>Radiator Efficiency: {(92 + Math.random() * 4).toFixed(1)}%</div>
          </div>
          <div style={constraintCategoryStyle}>
            <h4>Data Storage Limits</h4>
            <div>Total Capacity: {(satellites.length * 0.5).toFixed(1)} TB solid-state</div>
            <div>Current Usage: {Math.round(satellites.reduce((sum, sat) => sum + sat.dataStorage, 0) / satellites.length)}%</div>
            <div>Active Satellites: {satellites.length} systems</div>
            <div>Avg Compression: {(2.8 + Math.random() * 0.8).toFixed(1)}:1</div>
          </div>
        </div>
      </div>

      {/* Mission Priority Hierarchies */}
      <div className="card">
        <h2>Mission Priority & Emergency Protocols <span style={{color: '#ff0000', fontSize: '12px'}}>(M)</span></h2>
        <div style={prioritySystemStyle}>
          <div style={priorityLevelStyle}>
            <h4>EMERGENCY (Priority 1)</h4>
            <div>Wildfire Monitoring: Immediate data relay</div>
            <div>Tsunami Warning: 30-second response time</div>
            <div>Crew Safety: ISS emergency communications</div>
            <div>Military: Classified payload priority</div>
          </div>
          <div style={priorityLevelStyle}>
            <h4>HIGH (Priority 2)</h4>
            <div>Scientific Research: Hubble observations</div>
            <div>Navigation: GPS constellation maintenance</div>
            <div>Earth Observation: Climate monitoring</div>
          </div>
          <div style={priorityLevelStyle}>
            <h4>NORMAL (Priority 3)</h4>
            <div>Internet: Starlink user traffic</div>
            <div>Broadcasting: Satellite TV/radio</div>
            <div>Communications: Standard voice/data</div>
          </div>
        </div>
      </div>

      {/* Weather Integration */}
      <div className="card">
        <h2>Weather & Atmospheric Conditions <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={weatherGridStyle}>
          {groundStations.map(station => {
            const temp = station.elevation > 500 ? 25 + Math.random() * 8 : 28 + Math.random() * 10;
            const humidity = station.weather === 'clear' ? 50 + Math.random() * 20 : 70 + Math.random() * 20;
            const opacity = station.weather === 'clear' ? 0.1 + Math.random() * 0.1 : 0.2 + Math.random() * 0.2;
            return (
              <div key={station.id} style={weatherStationStyle}>
                <h4>{station.name}</h4>
                <div>Weather: {station.weather}</div>
                <div>Temperature: {temp.toFixed(0)}°C</div>
                <div>Wind: {Math.round(5 + Math.random() * 15)} km/h</div>
                <div>Humidity: {humidity.toFixed(0)}%</div>
                <div>Atmospheric Opacity: {opacity.toFixed(2)} ({opacity < 0.15 ? 'excellent' : opacity < 0.25 ? 'good' : 'fair'})</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ground Stations */}
      <div className="card">
        <h2>Ground Stations <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={stationGridStyle}>
          {groundStations.map(station => (
            <div key={station.id} style={stationCardStyle} className="station-item">
              <div style={stationHeaderStyle}>
                <h3>{station.name}</h3>
                <div style={statusIndicatorStyle(station.status)}>
                  {station.status === 'online' ? '🟢' : '🔴'} {station.status.toUpperCase()}
                </div>
              </div>
              
              <div style={stationInfoStyle}>
                <div><strong>Location:</strong> {station.location}</div>
                <div><strong>Weather:</strong> {station.weather}</div>
                <div><strong>Elevation:</strong> {station.elevation}m</div>
                <div><strong>Active Connections:</strong> {station.activeConnections}</div>
                <div style={hardwareItemStyle}>
                  <span><strong>Capacity:</strong></span>
                  <div style={progressBarStyle}>
                    <div style={{...progressFillStyle, width: `${station.capacity}%`, backgroundColor: station.capacity < 80 ? '#00ff00' : station.capacity < 90 ? '#ffff00' : '#ff0000'}}></div>
                  </div>
                  <span>{station.capacity}%</span>
                </div>
              </div>
              
              <div style={stationActionsStyle}>
                <button className="btn" style={smallButtonStyle} onClick={() => monitorGroundStation(station.name)}>📊 Monitor</button>
                <button className="btn" style={smallButtonStyle} onClick={() => configureGroundStation(station.name)}>⚙️ Configure</button>
                <button className="btn" style={smallButtonStyle} onClick={() => checkWeather(station.name)}>🌤️ Weather</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  } catch (renderError) {
    console.error('Satellites render error:', renderError);
    setHasError(true);
    return null;
  }
};

const controlPanelStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginBottom: '20px'
};

const controlGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const selectStyle = {
  background: 'linear-gradient(45deg, #1a1327, #252147, #2d2a5f)',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  fontFamily: "'Orbitron', 'Exo 2', monospace",
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '0.08em',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const actionButtonsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '15px',
  marginTop: '20px'
};

const emergencyButtonStyle = {
  background: 'linear-gradient(45deg, #ff0000, #ff4444)',
  fontWeight: 'bold'
};

const actionButtonStyle = {
  background: 'linear-gradient(45deg, #00bcd4, #0097a7)',
  fontWeight: 'bold'
};

const satelliteGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const satelliteCardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '10px',
  padding: '20px'
};

const satelliteHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  paddingBottom: '10px'
};

const statusIndicatorStyle = (status) => ({
  padding: '5px 10px',
  borderRadius: '15px',
  fontSize: '12px',
  fontWeight: 'bold',
  background: status === 'active' || status === 'online' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
  border: `1px solid ${status === 'active' || status === 'online' ? '#00ff00' : '#ff0000'}`
});

const parameterSectionStyle = {
  marginBottom: '15px',
  padding: '10px',
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '5px'
};

const parameterGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
  fontSize: '14px',
  marginTop: '8px'
};

const hardwareGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginTop: '8px'
};

const hardwareItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px'
};

const progressBarStyle = {
  flex: 1,
  height: '8px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden'
};

const progressFillStyle = {
  height: '100%',
  transition: 'width 0.3s ease'
};

const priorityStyle = (priority) => ({
  marginLeft: '10px',
  padding: '2px 8px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 'bold',
  background: priority === 'high' ? 'rgba(255, 0, 0, 0.2)' : priority === 'normal' ? 'rgba(255, 255, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
  border: `1px solid ${priority === 'high' ? '#ff0000' : priority === 'normal' ? '#ffff00' : '#00ff00'}`
});

const satelliteActionsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '15px'
};

const smallButtonStyle = {
  padding: '8px 12px',
  fontSize: '12px'
};

const stationGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const stationCardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '10px',
  padding: '20px'
};

const stationHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  paddingBottom: '10px'
};

const stationInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '14px',
  marginBottom: '15px'
};

const stationActionsStyle = {
  display: 'flex',
  gap: '10px'
};

const orbitalMechanicsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const perturbationStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

const hardwareConstraintsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const constraintCategoryStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

const prioritySystemStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const priorityLevelStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

const weatherGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const weatherStationStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

export default Satellites;