import React, { useState, useEffect } from 'react';
import * as satellite from 'satellite.js';
import * as turf from '@turf/turf';

const SatelliteCalculator = () => {
  const [tleData, setTleData] = useState({
    line1: '1 25544U 98067A   25001.00000000  .00002182  00000-0  40864-4 0  9990',
    line2: '2 25544  51.6461 339.2971 0002829  68.6102 291.5211 15.48919103123456'
  });
  const [calculations, setCalculations] = useState(null);
  const [groundStation, setGroundStation] = useState({
    lat: 12.9716,
    lon: 77.5946,
    alt: 0.920 // ISRO Bangalore
  });

  useEffect(() => {
    calculateOrbit();
  }, [tleData, groundStation]);

  const calculateOrbit = () => {
    try {
      // Parse TLE data using satellite.js
      const satrec = satellite.twoline2satrec(tleData.line1, tleData.line2);
      const now = new Date();
      
      // Calculate current position
      const positionAndVelocity = satellite.propagate(satrec, now);
      const positionEci = positionAndVelocity.position;
      const velocityEci = positionAndVelocity.velocity;
      
      if (!positionEci || typeof positionEci.x !== 'number') {
        throw new Error('Invalid TLE data');
      }

      // Convert to geodetic coordinates
      const gmst = satellite.gstime(now);
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);
      
      const latitude = satellite.degreesLat(positionGd.latitude);
      const longitude = satellite.degreesLong(positionGd.longitude);
      const altitude = positionGd.height;

      // Calculate look angles using Turf.js
      const satPoint = turf.point([longitude, latitude]);
      const gsPoint = turf.point([groundStation.lon, groundStation.lat]);
      const distance = turf.distance(satPoint, gsPoint, { units: 'kilometers' });
      const bearing = turf.bearing(gsPoint, satPoint);

      // Calculate elevation angle
      const earthRadius = 6371; // km
      const slantRange = Math.sqrt(
        Math.pow(distance, 2) + 
        Math.pow(altitude - groundStation.alt, 2)
      );
      const elevation = Math.asin((altitude - groundStation.alt) / slantRange) * (180 / Math.PI);

      // Calculate orbital period and velocity
      const mu = 398600.4418; // Earth's gravitational parameter
      const r = earthRadius + altitude;
      const orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / mu) / 60; // minutes
      const orbitalVelocity = Math.sqrt(mu / r); // km/s

      // Predict next passes
      const nextPasses = predictPasses(satrec, groundStation, 24); // next 24 hours

      setCalculations({
        position: { latitude, longitude, altitude },
        velocity: {
          x: velocityEci.x,
          y: velocityEci.y,
          z: velocityEci.z,
          magnitude: Math.sqrt(velocityEci.x**2 + velocityEci.y**2 + velocityEci.z**2)
        },
        lookAngles: {
          distance,
          bearing,
          elevation,
          slantRange
        },
        orbital: {
          period: orbitalPeriod,
          velocity: orbitalVelocity,
          apogee: r + (r * 0.1), // simplified
          perigee: r - (r * 0.1)  // simplified
        },
        nextPasses,
        timestamp: now.toISOString()
      });
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculations({ error: error.message });
    }
  };

  const predictPasses = (satrec, gs, hours) => {
    const passes = [];
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);
    
    for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 5)) {
      const posVel = satellite.propagate(satrec, time);
      if (posVel.position) {
        const gmst = satellite.gstime(time);
        const posGd = satellite.eciToGeodetic(posVel.position, gmst);
        
        const lat = satellite.degreesLat(posGd.latitude);
        const lon = satellite.degreesLong(posGd.longitude);
        const alt = posGd.height;
        
        const satPoint = turf.point([lon, lat]);
        const gsPoint = turf.point([gs.lon, gs.lat]);
        const distance = turf.distance(satPoint, gsPoint, { units: 'kilometers' });
        
        const slantRange = Math.sqrt(distance**2 + (alt - gs.alt)**2);
        const elevation = Math.asin((alt - gs.alt) / slantRange) * (180 / Math.PI);
        
        if (elevation > 10 && passes.length < 5) { // Above 10 degrees
          passes.push({
            time: time.toISOString(),
            elevation: elevation.toFixed(1),
            distance: distance.toFixed(1)
          });
        }
      }
    }
    
    return passes;
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', color: '#fff' }}>
      <h3> Satellite.js Calculator</h3>
      
      {/* TLE Input */}
      <div style={{ marginBottom: '20px' }}>
        <h4>TLE Data Input</h4>
        <textarea
          value={tleData.line1}
          onChange={(e) => setTleData({...tleData, line1: e.target.value})}
          style={{ width: '100%', height: '40px', marginBottom: '5px', background: '#333', color: '#fff', border: '1px solid #555' }}
          placeholder="TLE Line 1"
        />
        <textarea
          value={tleData.line2}
          onChange={(e) => setTleData({...tleData, line2: e.target.value})}
          style={{ width: '100%', height: '40px', background: '#333', color: '#fff', border: '1px solid #555' }}
          placeholder="TLE Line 2"
        />
      </div>

      {/* Ground Station */}
      <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <div>
          <label>Latitude:</label>
          <input
            type="number"
            value={groundStation.lat}
            onChange={(e) => setGroundStation({...groundStation, lat: parseFloat(e.target.value)})}
            style={{ width: '100%', background: '#333', color: '#fff', border: '1px solid #555' }}
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input
            type="number"
            value={groundStation.lon}
            onChange={(e) => setGroundStation({...groundStation, lon: parseFloat(e.target.value)})}
            style={{ width: '100%', background: '#333', color: '#fff', border: '1px solid #555' }}
          />
        </div>
        <div>
          <label>Altitude (km):</label>
          <input
            type="number"
            value={groundStation.alt}
            onChange={(e) => setGroundStation({...groundStation, alt: parseFloat(e.target.value)})}
            style={{ width: '100%', background: '#333', color: '#fff', border: '1px solid #555' }}
          />
        </div>
      </div>

      {/* Results */}
      {calculations && !calculations.error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>🛰️ Current Position</h4>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '5px' }}>
              <div>Latitude: {calculations.position.latitude.toFixed(4)}°</div>
              <div>Longitude: {calculations.position.longitude.toFixed(4)}°</div>
              <div>Altitude: {calculations.position.altitude.toFixed(2)} km</div>
            </div>

            <h4>📡 Look Angles</h4>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '5px' }}>
              <div>Distance: {calculations.lookAngles.distance.toFixed(2)} km</div>
              <div>Bearing: {calculations.lookAngles.bearing.toFixed(1)}°</div>
              <div>Elevation: {calculations.lookAngles.elevation.toFixed(1)}°</div>
              <div>Slant Range: {calculations.lookAngles.slantRange.toFixed(2)} km</div>
            </div>
          </div>

          <div>
            <h4>🚀 Orbital Parameters</h4>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '5px' }}>
              <div>Period: {calculations.orbital.period.toFixed(1)} min</div>
              <div>Velocity: {calculations.orbital.velocity.toFixed(2)} km/s</div>
              <div>Apogee: {calculations.orbital.apogee.toFixed(0)} km</div>
              <div>Perigee: {calculations.orbital.perigee.toFixed(0)} km</div>
            </div>

            <h4>⏰ Next Passes</h4>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '5px', maxHeight: '150px', overflow: 'auto' }}>
              {calculations.nextPasses.map((pass, idx) => (
                <div key={idx} style={{ fontSize: '12px', marginBottom: '5px' }}>
                  {new Date(pass.time).toLocaleTimeString()} - Elev: {pass.elevation}° - Dist: {pass.distance}km
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {calculations && calculations.error && (
        <div style={{ color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: '10px', borderRadius: '5px' }}>
          Error: {calculations.error}
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
        <strong>Libraries:</strong> Satellite.js (orbital mechanics) + Turf.js (geospatial calculations)
      </div>
    </div>
  );
};

export default SatelliteCalculator;