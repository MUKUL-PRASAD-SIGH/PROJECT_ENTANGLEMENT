import React, { useEffect, useRef, useState } from 'react';

// Global lock to prevent multiple Cesium viewers
window.CESIUM_GLOBE_LOCK = window.CESIUM_GLOBE_LOCK || false;

const Globe = () => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);
  const [status, setStatus] = useState('Loading SINGLE Globe...');
  const [satellites, setSatellites] = useState([]);
  const [globeId] = useState('SINGLE-GLOBE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9));
  const [isConnected, setIsConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [viewMode, setViewMode] = useState('3D');
  const [trackingMode, setTrackingMode] = useState('AUTO');
  const [scannerActive, setScannerActive] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockIcon, setShowLockIcon] = useState(false);
  const [showLiveNotification, setShowLiveNotification] = useState(false);
  const [showMenu, setShowMenu] = useState(true);


  const toggleFullscreen = () => {
  if (!cesiumContainer.current) return;
  const elem = cesiumContainer.current;

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      console.error(`Error attempting fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};



  useEffect(() => {
    console.log('Initializing SINGLE globe with ID:', globeId);
    
    // Prevent multiple initializations with global lock
    if (window.CESIUM_GLOBE_LOCK || window.cesiumViewer || viewerRef.current || initializingRef.current) {
      console.log('Cesium already initialized or locked, skipping...');
      return;
    }
    
    window.CESIUM_GLOBE_LOCK = true;
    
    const initCesium = () => {
      if (!window.Cesium || !cesiumContainer.current || initializingRef.current || !mountedRef.current) {
        if (!initializingRef.current && mountedRef.current) {
          setTimeout(initCesium, 100);
        }
        return;
      }

      initializingRef.current = true;

      try {
        // Set Cesium Ion access token if not already set
        if (!window.Cesium.Ion.defaultAccessToken) {
          window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2VmNjUxZS1jYTYzLTQwMDItYTI4MS1lZjQ0YjQxYWMxZjgiLCJpZCI6OTAxNjUsImlhdCI6MTYyMTE4NzI5Mn0.w-nLV4Z8xr1x0H_7LmqplOxRjzwBwDNkLcbVqD_3X9s';
        }
        
        // Destroy any existing viewers first
        if (window.cesiumViewer) {
          try {
            window.cesiumViewer.destroy();
          } catch (e) {
            console.warn('Error destroying previous viewer:', e);
          }
          window.cesiumViewer = null;
        }
        if (viewerRef.current) {
          try {
            viewerRef.current.destroy();
          } catch (e) {
            console.warn('Error destroying ref viewer:', e);
          }
          viewerRef.current = null;
        }
        
        // Vibrant Earth with ESRI World Imagery
        const viewer = new window.Cesium.Viewer(cesiumContainer.current, {
          imageryProvider: new window.Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
          }),
          baseLayerPicker: true,
          geocoder: true,
          homeButton: true,
          sceneModePicker: true,
          navigationHelpButton: true,
          fullscreenButton: true,
          animation: true,
          timeline: true,
          creditContainer: document.createElement('div')
        });

        viewer.fullscreenButton.viewModel.fullscreenElement = cesiumContainer.current;
        
        
        // Simple vibrant enhancements
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.globe.atmosphereLightIntensity = 3.0;
        viewer.scene.globe.atmosphereSaturationShift = 0.2;
        
        // Move credits to top right
        setTimeout(() => {
          const creditContainer = viewer.creditContainer;
          if (creditContainer) {
            creditContainer.style.position = 'absolute';
            creditContainer.style.top = '10px';
            creditContainer.style.right = '10px';
            creditContainer.style.bottom = 'auto';
            creditContainer.style.left = 'auto';
            creditContainer.style.fontSize = '10px';
            creditContainer.style.background = 'rgba(0, 0, 0, 0.5)';
            creditContainer.style.padding = '5px';
            creditContainer.style.borderRadius = '5px';
            creditContainer.style.zIndex = '1000';
          }
        }, 1000);
        
        // Style CesiumJS controls with cyberpunk theme
        setTimeout(() => {
          const toolbar = document.querySelector('.cesium-viewer-toolbar');
          if (toolbar) {
            toolbar.style.background = 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))';
            toolbar.style.border = '2px solid #00ffff';
            toolbar.style.borderRadius = '10px';
            toolbar.style.backdropFilter = 'blur(10px)';
            toolbar.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
          }
          
          const bottomToolbar = document.querySelector('.cesium-viewer-bottom');
          if (bottomToolbar) {
            bottomToolbar.style.background = 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))';
            bottomToolbar.style.border = '2px solid #ff00ff';
            bottomToolbar.style.borderRadius = '10px';
            bottomToolbar.style.backdropFilter = 'blur(10px)';
            bottomToolbar.style.zIndex = '9999';
            bottomToolbar.style.position = 'relative';
          }
          
          // Ensure all CesiumJS buttons are clickable
          const allButtons = document.querySelectorAll('.cesium-button, .cesium-toolbar-button');
          allButtons.forEach(btn => {
            btn.style.zIndex = '9999';
            btn.style.position = 'relative';
            btn.style.pointerEvents = 'auto';
          });
          
          // Fix timeline and animation controls
          const timeline = document.querySelector('.cesium-timeline-main');
          if (timeline) {
            timeline.style.zIndex = '9999';
            timeline.style.position = 'relative';
          }
          
          const animation = document.querySelector('.cesium-animation-widget');
          if (animation) {
            animation.style.zIndex = '9999';
            animation.style.position = 'relative';
          }
        }, 1000);

        viewer.entities.add({
          position: window.Cesium.Cartesian3.fromDegrees(77.5946, 12.9716),
          point: {
            pixelSize: 15,
            color: window.Cesium.Color.CYAN,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 2
          },
          label: {
            text: '🚀 ISRO Bangalore',
            font: '14pt Arial',
            fillColor: window.Cesium.Color.WHITE,
            style: window.Cesium.LabelStyle.FILL,
            pixelOffset: new window.Cesium.Cartesian2(0, -40)
          }
        });
        viewer.entities.add({
          name: "Moon",
          position: window.Cesium.Cartesian3.fromDegrees(-60, 0, 384400000),
          ellipsoid: {
            radii: new window.Cesium.Cartesian3(1737000, 1737000, 1737000),
            material: new window.Cesium.ImageMaterialProperty({
              image: "https://planetarynames.wr.usgs.gov/images/moon_texture.jpg",
            }),
          },
        });

        // Set home view to your location (India region) with good globe visibility
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(e) {
          e.cancel = true;
          viewer.camera.flyTo({
            destination: window.Cesium.Cartesian3.fromDegrees(77.5946, 12.9716, 8000000),
            orientation: {
              heading: 0.0,
              pitch: -window.Cesium.Math.PI_OVER_TWO,
              roll: 0.0
            }
          });
        });
        
        // Initial view
        viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(77.5946, 12.9716, 8000000)
        });
        
        // Remove any existing scale displays first
        const existingScales = document.querySelectorAll('[id="scale-display"]');
        existingScales.forEach(scale => scale.remove());
        
        // Add live scale display
        const scaleDisplay = document.createElement('div');
        scaleDisplay.style.position = 'absolute';
        scaleDisplay.style.bottom = '40px';
        scaleDisplay.style.left = '1280px';
        scaleDisplay.style.background = 'linear-gradient(135deg, rgba(48, 42, 42, 0.31), rgba(255, 0, 255, 0.2))';
        scaleDisplay.style.color = '#00ffff';
        scaleDisplay.style.padding = '15px';
        scaleDisplay.style.borderRadius = '15px';
        scaleDisplay.style.fontSize = '15px';
        scaleDisplay.style.zIndex = '99999';
        scaleDisplay.style.border = '2px solid #00ffff';
        scaleDisplay.style.backdropFilter = 'blur(1px)';
        scaleDisplay.style.fontFamily = 'Consolas, monospace';
        scaleDisplay.style.boxShadow = '0 0 20px rgba(0, 0, 0, 1)';
        scaleDisplay.id = 'scale-display';
        cesiumContainer.current.appendChild(scaleDisplay);
        
        // Update scale display on camera move
        viewer.camera.changed.addEventListener(() => {
          const altitude = viewer.camera.positionCartographic.height;
          const altitudeKm = (altitude / 1000).toFixed(1);
          const scale = altitude > 10000000 ? 'Global' : 
                      altitude > 1000000 ? 'Continental' :
                      altitude > 100000 ? 'Regional' :
                      altitude > 10000 ? 'City' : 'Local';
          scaleDisplay.innerHTML = `
            <div style="font-weight: bold; color: #ffff00; margin-bottom: 5px;">SCALE INDICATOR</div>
            <div>Altitude: ${altitudeKm} km</div>
            <div>Scale: ${scale}</div>
            <div>Zoom Level: ${Math.round(10 - Math.log10(altitude/1000))}</div>
          `;
        });

        setStatus('SINGLE CesiumJS Active');
        fetchSatellites(viewer);

      } catch (error) {
        console.error('Error initializing Cesium:', error);
        setStatus('Error: ' + error.message);
        initializingRef.current = false;
      }
    };

    initCesium();
    
    return () => {
      console.log('Cleaning up Globe component:', globeId);
      mountedRef.current = false;
      
      // Clean up scale display
      const existingScale = document.getElementById('scale-display');
      if (existingScale) {
        existingScale.remove();
      }
      
      // Clean up tracking interval
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
      
      // Properly destroy viewer
      initializingRef.current = false;
      window.CESIUM_GLOBE_LOCK = false;
      
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying ref viewer on cleanup:', e);
        }
        viewerRef.current = null;
      }
      if (window.cesiumViewer) {
        try {
          window.cesiumViewer.destroy();
        } catch (e) {
          console.warn('Error destroying global viewer on cleanup:', e);
        }
        window.cesiumViewer = null;
      }
      
      console.log('🧹 Globe cleanup completed:', globeId);
    };
  }, []);

  const fetchSatellites = async (viewer) => {
    try {
      console.log('Fetching CZML data from backend...');
      const response = await fetch('http://localhost:5000/api/satellites/czml?duration_hours=24&step_minutes=5');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('CZML data:', data);
      
      if (data.czml && data.czml.length > 1) {
        // Load CZML data for time-dynamic satellites
        const czmlDataSource = await window.Cesium.CzmlDataSource.load(data.czml);
        if (viewer && viewer.dataSources) {
          viewer.dataSources.add(czmlDataSource);
        }
        
        // Configure satellites to be clickable
        czmlDataSource.entities.values.forEach(entity => {
          if (entity.point) {
            entity.point.heightReference = window.Cesium.HeightReference.NONE;
            entity.point.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            entity.point.scaleByDistance = new window.Cesium.NearFarScalar(1.0e3, 2.0, 1.0e7, 0.5);
          }
        });
        
        // Add click handler for satellite selection
        viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((event) => {
          const picked = viewer.scene.pick(event.position);
          if (picked && picked.id && picked.id.id) {
            setSelectedSatellite(picked.id.id);
            console.log('Selected satellite:', picked.id.id);
            // Highlight selected satellite
            czmlDataSource.entities.values.forEach(entity => {
              if (entity.point) {
                entity.point.pixelSize = entity.id === picked.id.id ? 20 : 15;
                entity.point.outlineWidth = entity.id === picked.id.id ? 3 : 2;
              }
            });
          }
        }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        
        // Set clock to match CZML timeline
        const startTime = window.Cesium.JulianDate.fromIso8601(data.time_range.start + 'Z');
        const endTime = window.Cesium.JulianDate.fromIso8601(data.time_range.end + 'Z');
        
        viewer.clock.startTime = startTime;
        viewer.clock.stopTime = endTime;
        viewer.clock.currentTime = startTime;
        viewer.clock.clockRange = window.Cesium.ClockRange.LOOP_STOP;
        viewer.clock.multiplier = 1; // Real-time speed
        viewer.clock.shouldAnimate = true; // Enable animation
        
        // Force animation widget to show 1x on startup
        setTimeout(() => {
          if (viewer.animation && viewer.animation.viewModel) {
            viewer.animation.viewModel.multiplier = 1;
            viewer.animation.viewModel.shuttleRingDragging = false;
          }
        }, 1000);
        
        // Enable timeline
        viewer.timeline.zoomTo(startTime, endTime);
        
        // Ensure timeline shows 1x speed
        setTimeout(() => {
          if (viewer.timeline) {
            viewer.timeline.updateFromClock();
          }
        }, 1500);
        
        // Store viewer globally for LIVE button access
        window.cesiumViewer = viewer;
        viewerRef.current = viewer;
        initializingRef.current = false;
        
        console.log('✅ Cesium Globe initialized successfully:', globeId);
        

        
        setSatellites(data.czml.slice(1).map(sat => ({ name: sat.name })));
        setStatus(`✅ LIVE ORBITAL DATA - ${data.satellites_count} satellites with real trajectories`);
        
        // Show connection notification
        if (!isConnected) {
          setIsConnected(true);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
        
        // Add ISRO marker (static)
        viewer.entities.add({
          position: window.Cesium.Cartesian3.fromDegrees(77.5946, 12.9716),
          point: {
            pixelSize: 15,
            color: window.Cesium.Color.CYAN,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 2
          },
          label: {
            text: '🚀 ISRO Bangalore',
            font: '14pt Arial',
            fillColor: window.Cesium.Color.WHITE,
            style: window.Cesium.LabelStyle.FILL,
            pixelOffset: new window.Cesium.Cartesian2(0, -40)
          }
        });
        
        console.log(`Total satellites with orbital trajectories: ${data.satellites_count}`);
        return;
      } else {
        throw new Error('No CZML data in response');
      }
    } catch (error) {
      console.error('CZML backend connection failed:', error);
      
      // Show disconnection notification
      if (isConnected) {
        setIsConnected(false);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
      const mockSats = [
        { name: '🎭 ISS', latitude: 19.41, longitude: -92.00, altitude: 419.05 },
        { name: '🎭 HUBBLE', latitude: 28.5, longitude: -80.6, altitude: 547.0 },
        { name: '🎭 STARLINK-1', latitude: 45.2, longitude: 120.1, altitude: 550.0 },
        { name: '🎭 STARLINK-2', latitude: -15.8, longitude: 45.3, altitude: 550.0 },
        { name: '🎭 GPS-III', latitude: 35.2, longitude: -95.1, altitude: 20200.0 },
        { name: '🎭 GALILEO', latitude: -25.8, longitude: 28.3, altitude: 23222.0 },
        { name: '🎭 GLONASS', latitude: 55.2, longitude: 37.6, altitude: 19130.0 },
        { name: '🎭 BEIDOU', latitude: 39.9, longitude: 116.4, altitude: 21528.0 }
      ];
      
      setSatellites(mockSats);
      setStatus(`🎭 Mock - ${mockSats.length} satellites (ISS, Hubble, Starlink, GPS, Galileo, GLONASS, BeiDou)`);
      
      mockSats.forEach((sat, index) => {
        console.log(`Adding mock satellite ${index + 1}:`, sat.name, 'at', sat.latitude, sat.longitude, sat.altitude);
        viewer.entities.add({
          id: `mock-satellite-${index}`,
          position: window.Cesium.Cartesian3.fromDegrees(sat.longitude, sat.latitude, sat.altitude * 1000),
          point: {
            pixelSize: 15,
            color: index === 0 ? window.Cesium.Color.YELLOW : 
                   index === 1 ? window.Cesium.Color.ORANGE :
                   index === 2 ? window.Cesium.Color.RED :
                   window.Cesium.Color.PINK,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 3,
            heightReference: window.Cesium.HeightReference.NONE
          },
          label: {
            text: sat.name,
            font: '14pt Arial',
            fillColor: window.Cesium.Color.WHITE,
            style: window.Cesium.LabelStyle.FILL,
            pixelOffset: new window.Cesium.Cartesian2(0, -40),
            heightReference: window.Cesium.HeightReference.NONE
          }
        });
      });
      console.log(`Total mock satellites added: ${mockSats.length}`);
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      position: 'relative',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0033 25%, #330066 50%, #1a0033 75%, #0a0a0a 100%)',
      border: '3px solid #00ffff',
      borderRadius: '20px',
      boxShadow: '0 0 30px #00ffff, inset 0 0 30px rgba(0, 255, 255, 0.1)',
      overflow: 'hidden'
    }}>
      <div 
        ref={cesiumContainer} 
        id={globeId}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '17px',
          border: '2px solid rgba(0, 255, 255, 0.3)'
        }}
      />
      
      {/* Enhanced Spaceship Control Center */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 0, 255, 0) 50%, rgba(0, 255, 0, 0) 100%)',
        backdropFilter: 'blur(2px)',
        border: '3px solid #00ffff92',
        color: '#00ffffff',
        padding: '20px',
        borderRadius: '20px',
        fontSize: '15px',
        zIndex: 1000,
        fontFamily: 'Consolas, monospace',
        boxShadow: '0 0 1px rgba(0, 0, 0, 1), inset 0 0 40px rgba(0, 0, 0, 1)',
        minWidth: '280px',
        textShadow: '0 0 15px currentColor',
        animation: 'controlPulse 3s ease-in-out infinite'
      }}>
        <div style={{ color: '#ffffffff', fontWeight: 'bold', marginBottom: '12px', fontSize: '18px', textAlign: 'center' }}>
          ASTRAEUS COMMAND CENTER
        </div>
        
        {/* Status Display */}
<div
  style={{
    marginBottom: "15px",
    padding: "16px",
    borderRadius: "12px",
    background: "linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.7))",
    boxShadow: "0 0 12px rgba(0, 255, 100, 0.25), inset 0 0 8px rgba(0, 255, 100, 0.15)",
    border: "1px solid rgba(0,255,100,0.4)",
    color: "#fff",
    fontFamily: "Consolas, monospace",
  }}
>
  {/* Satellites Count */}
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
    <span style={{ color: "#ffe066", fontWeight: "bold" }}>SATELLITES:</span>
    <span>{satellites.length}</span>
  </div>

  {/* Connection */}
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
    <span style={{ color: "#4dff4d", fontWeight: "bold" }}>CONNECTION:</span>
    <span style={{ color: isConnected ? "#00ff90" : "#ff4444", fontWeight: "bold" }}>
      {isConnected ? "ONLINE" : "OFFLINE"}
    </span>
  </div>
</div>
      
        {/* View Controls */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#ffffffff', fontWeight: 'bold', fontSize: '15px' }}>VIEW MODE:</span>
            {['3D', '2D', 'CV'].map(mode => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  if (window.cesiumViewer) {
                    if (mode === '3D') {
                      window.cesiumViewer.scene.morphTo3D(2.0);
                      console.log('Switched to 3D view');
                    } else if (mode === '2D') {
                      window.cesiumViewer.scene.morphTo2D(2.0);
                      console.log('Switched to 2D view');
                    } else if (mode === 'CV') {
                      window.cesiumViewer.scene.morphToColumbusView(2.0);
                      console.log('Switched to Columbus view');
                    }
                  }
                }}
                style={{
                  background: viewMode === mode ? 'linear-gradient(45deg, #242924ff, #566861ff)' : 'rgba(0, 255, 255, 0.2)',
                  border: '1px solid #237474ff',
                  color: '#ffffffff',
                  padding: '5px 10px',
                  borderRadius: '7px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'Consolas, monospace',
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
                  textShadow: '0 0 5px currentColor'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

         {/* ✅ Fullscreen Button */}
  <button onClick={toggleFullscreen}
          style={{border: '2px solid #00e1ff',
                  background: 'linear-gradient(45deg, #43a5c1ff, #00f1bdff)',
                  color: '#ffffffff',
                  padding: '8px 100px',
                  borderRadius: '7px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'Consolas, monospace',
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.33)',
                  textShadow: '0 0 5px currentColor',
                  marginBottom: "10px",
                  display: "block",
                  width: "100%" }}
          >
            Toggle FullScreen</button>
        
        
        
        {/* LIVE Button */}
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={() => {
              if (window.cesiumViewer && window.cesiumViewer.clock) {
                // Set to current real time
                const now = new Date();
                const julianNow = window.Cesium.JulianDate.fromDate(now);
                
                // Update clock settings
                window.cesiumViewer.clock.currentTime = julianNow;
                window.cesiumViewer.clock.shouldAnimate = true;
                window.cesiumViewer.clock.multiplier = 1;
                window.cesiumViewer.clock.clockStep = window.Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
                
                // Update timeline to current time and 1x speed
                if (window.cesiumViewer.timeline) {
                  window.cesiumViewer.timeline.updateFromClock();
                  window.cesiumViewer.timeline.zoomTo(julianNow, window.Cesium.JulianDate.addHours(julianNow, 2, new window.Cesium.JulianDate()));
                }
                
                // Force update animation widget
                if (window.cesiumViewer.animation) {
                  window.cesiumViewer.animation.viewModel.multiplier = 1;
                  window.cesiumViewer.animation.viewModel.shuttleRingDragging = false;
                }
                
                console.log('Switched to LIVE timing at 1x speed at current time:', now.toISOString());
                
                // Show LIVE notification
                setShowLiveNotification(true);
                setTimeout(() => setShowLiveNotification(false), 3000);
              }
            }}
            style={{
              background: 'linear-gradient(45deg, #ff0000, #ff4444)',
              color: 'white',
              border: '2px solid #ff6666',
              padding: '8px 15px',
              borderRadius: '10px',
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: 'Consolas, monospace',
              fontWeight: 'bold',
              width: '100%',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
              textShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
            }}
          >
            LIVE MODE
          </button>
        </div>
        

      </div>
      {/* LIVE Mode Notification */}
      {showLiveNotification && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(45deg, #ff0000, #ff4444)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 10000,
          boxShadow: '0 0 30px rgba(255, 0, 0, 0.8)',
          animation: 'pulse 0.5s ease-in-out',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          textAlign: 'center'
        }}>
          🔴 LIVE MODE ACTIVATED<br/>
          <span style={{fontSize: '12px'}}>Real-time at 1x speed</span>
        </div>
      )}
      
      {/* Live Connection Notification */}
      {showNotification && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: isConnected 
            ? 'linear-gradient(45deg, #00ff00, #00ff88)' 
            : 'linear-gradient(45deg, #ff0000, #ff4444)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 2000,
          boxShadow: isConnected 
            ? '0 0 20px #00ff00, 0 0 40px #00ff00' 
            : '0 0 20px #ff0000, 0 0 40px #ff0000',
          animation: 'pulse 0.5s ease-in-out',
          textShadow: '0 0 10px currentColor'
        }}>
          {isConnected ? '🟢 BACKEND CONNECTED' : '🔴 BACKEND DISCONNECTED'}
        </div>
      )}
      
      {/* Neon Corner Accents */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(225deg, transparent 50%, rgba(255, 0, 255, 0.3) 50%)',
        borderBottomLeft: '3px solid #ff00ff',
        borderTopRightRadius: '17px',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(45deg, transparent 50%, rgba(0, 255, 255, 0.3) 50%)',
        borderTopRight: '3px solid #00ffff',
        borderBottomLeftRadius: '17px',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      
      {/* Scanning Lines Effect - Lower z-index */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0, 255, 255, 0.05) 3px, rgba(0, 255, 255, 0.05) 6px)',
        pointerEvents: 'none',
        zIndex: -1,
        borderRadius: '17px'
      }} />
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes controlPulse {
          0% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 40px rgba(255, 0, 255, 0.2); }
          50% { box-shadow: 0 0 60px rgba(0, 255, 255, 0.8), inset 0 0 60px rgba(255, 0, 255, 0.3); }
          100% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 40px rgba(255, 0, 255, 0.2); }
        }
        @keyframes livePulse {
          0% { box-shadow: 0 0 30px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 50px rgba(255, 0, 0, 1), inset 0 0 30px rgba(255, 255, 255, 0.4); }
          100% { box-shadow: 0 0 30px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.2); }
        }
        @keyframes liveClick {
          0% { transform: translateY(-50%) scale(1); }
          50% { transform: translateY(-50%) scale(0.9); }
          100% { transform: translateY(-50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Globe;