# Project Entanglement - API Documentation

## 🏗️ Clean Architecture Overview

**Current Implementation**: Dual-server architecture with proper separation of concerns

### Server Architecture
```
Port 5000 (API Server) - REST API + Static Content
├── Complete RESTful API for all satellite operations
├── Interactive test interface at /websocket-test  
├── JSON responses for frontend integration
└── Static content serving (future React app)

Port 5001 (WebSocket Server) - Real-time Data Only
├── Live satellite position streaming (10-second intervals)
├── Real-time communication window detection
├── Multi-client subscription management  
└── System performance metrics broadcasting
```

### ✅ Benefits of This Architecture
- **Clean Separation**: Each server has focused responsibility
- **Scalable**: Can scale REST API and WebSocket servers independently  
- **Maintainable**: Clear boundaries between static/dynamic content
- **Production Ready**: Industry-standard architecture pattern

## 🛰️ REST API for Satellite Communication Scheduler

**Base URL:** `http://localhost:5000`  
**WebSocket URL:** `ws://localhost:5001`  
**API Version:** 1.0.0  
**Status:** Production Ready  

---

## 📡 API Overview

The Project Entanglement API provides real-time satellite tracking, communication window detection, and orbital mechanics simulation capabilities. Built for the ISRO SIH 2025 satellite communication scheduling challenge.

### Core Features
- ✅ Real-time satellite position tracking via REST and WebSocket
- ✅ Communication window detection and optimization
- ✅ Ground station management with visibility calculations
- ✅ Full constellation simulation with JSON responses
- ✅ Live TLE data integration from NASA/NORAD sources
- ✅ Interactive test interface for development and debugging
- ✅ Trajectory prediction and analysis

## 🚀 Quick Start Testing

### Test the Complete System
1. **Start both servers:**
   ```bash
   # Terminal 1: API Server
   cd backend && python api_server.py
   
   # Terminal 2: WebSocket Server
   cd backend && python websocket_server.py
   ```

2. **Open test interface:**
   ```
   http://localhost:5000/websocket-test
   ```

3. **Test real-time features:**
   - Click "Connect to WebSocket"
   - Click "Subscribe to Satellites" 
   - Watch live satellite positions update every 10 seconds
   - Click "Subscribe to Windows" for communication opportunities

---

## 📡 WebSocket Real-time API (Port 5001)

### Connection
```javascript
const socket = io('http://localhost:5001');
```

### Events You Can Send
- `subscribe_satellites` - Get live satellite position updates
- `subscribe_windows` - Get real-time communication windows
- `get_satellite_info` - Request detailed satellite information
- `request_simulation` - Run orbital simulation

### Events You'll Receive
- `satellite_update` - Live satellite positions (every 10 seconds)
- `window_update` - Communication window opportunities  
- `system_metrics` - Server performance and client statistics
- `server_status` - Connection status and available features

### Example Usage
```javascript
// Connect and subscribe to live satellite data
socket.on('connect', () => {
    socket.emit('subscribe_satellites', {});
});

socket.on('satellite_update', (data) => {
    console.log(`Received ${data.satellites.length} satellite positions`);
    data.satellites.forEach(sat => {
        console.log(`${sat.name}: ${sat.position.latitude}°N, ${sat.position.longitude}°E`);
    });
});
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start API Server
```bash
cd backend
python api_server.py
```

### 3. Test API Health
```bash
curl http://localhost:5000/
```

**Expected Response:**
```json
{
  "status": "online",
  "service": "Project Entanglement API",
  "version": "1.0.0",
  "message": "AI-Powered Satellite Communication Scheduler"
}
```

---

## 📋 API Endpoints

### Health & Status

#### `GET /`
Health check and API information

**Response:**
```json
{
  "status": "online",
  "service": "Project Entanglement API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## 🛰️ Satellite Management

### `GET /api/satellites`
Get list of all tracked satellites

**Response:**
```json
{
  "satellites": [
    {
      "name": "ISS (ZARYA)",
      "catalog_number": "25544",
      "added_time": "2025-09-04T12:00:00Z"
    }
  ],
  "count": 1,
  "status": "success"
}
```

### `POST /api/satellites`
Add new satellite from TLE data

**Request Body:**
```json
{
  "name": "ISS (ZARYA)",
  "line1": "1 25544U 98067A   25247.12345678 -.00000123  00000-0  12345-4 0  9990",
  "line2": "2 25544  51.6400 123.4567 0001234  12.3456 347.6789 15.12345678123456"
}
```

**Response:**
```json
{
  "message": "Satellite 'ISS (ZARYA)' added successfully",
  "satellite": {
    "name": "ISS (ZARYA)",
    "line1": "...",
    "line2": "..."
  },
  "status": "success"
}
```

### `GET /api/satellites/{name}/position`
Get current or specific time position of satellite

**Query Parameters:**
- `time` (optional): ISO timestamp (e.g., "2025-09-04T12:00:00Z")

**Response:**
```json
{
  "satellite": "ISS (ZARYA)",
  "position": {
    "latitude": 45.1234,
    "longitude": -123.4567,
    "altitude_km": 408.12,
    "time": "2025-09-04T12:00:00Z"
  },
  "status": "success"
}
```

### `GET /api/satellites/{name}/trajectory`
Get satellite trajectory over time period

**Query Parameters:**
- `duration_hours` (default: 6): How many hours to predict
- `step_minutes` (default: 10): Time step between points
- `start_time` (optional): ISO timestamp

**Response:**
```json
{
  "satellite": "ISS (ZARYA)",
  "trajectory": [
    {
      "time": "2025-09-04T12:00:00Z",
      "latitude": 45.1234,
      "longitude": -123.4567,
      "altitude_km": 408.12
    }
  ],
  "duration_hours": 6,
  "step_minutes": 10,
  "points_count": 36,
  "status": "success"
}
```

---

## 🌍 Ground Station Management

### `GET /api/ground-stations`
Get list of all ground stations

**Response:**
```json
{
  "ground_stations": [
    {
      "name": "ISRO Bangalore",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "elevation_m": 920
    }
  ],
  "count": 1,
  "status": "success"
}
```

### `POST /api/ground-stations`
Add new ground station

**Request Body:**
```json
{
  "name": "ISRO Bangalore",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "elevation_m": 920
}
```

**Response:**
```json
{
  "message": "Ground station 'ISRO Bangalore' added successfully",
  "station": {
    "name": "ISRO Bangalore",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "elevation_m": 920
  },
  "status": "success"
}
```

---

## 📡 Communication Windows

### `GET /api/communication-windows`
Find communication windows between satellites and ground stations

**Query Parameters:**
- `satellite` (optional): Specific satellite name
- `station` (optional): Specific ground station name
- `duration_hours` (default: 24): Search time period
- `start_time` (optional): ISO timestamp

**Response:**
```json
{
  "windows": [
    {
      "satellite": "ISS (ZARYA)",
      "station": "ISRO Bangalore",
      "start_time": "2025-09-04T14:23:00Z",
      "end_time": "2025-09-04T14:35:00Z",
      "duration_minutes": 12.5,
      "max_elevation_degrees": 67.8,
      "quality_score": 0.85
    }
  ],
  "count": 1,
  "total_duration_minutes": 12.5,
  "search_parameters": { ... },
  "status": "success"
}
```

### `GET /api/visibility`
Check if satellite is currently visible from ground station

**Query Parameters:**
- `satellite` (required): Satellite name
- `station` (required): Ground station name
- `time` (optional): ISO timestamp

**Response:**
```json
{
  "satellite": "ISS (ZARYA)",
  "station": "ISRO Bangalore",
  "time": "2025-09-04T12:00:00Z",
  "is_visible": true,
  "elevation_degrees": 45.7,
  "status": "success"
}
```

---

## 🔬 Simulation

### `POST /api/simulation/run`
Run complete satellite constellation simulation

**Request Body:**
```json
{
  "duration_hours": 24,
  "start_time": "2025-09-04T12:00:00Z"
}
```

**Response:**
```json
{
  "start_time": "2025-09-04T12:00:00Z",
  "duration_hours": 24,
  "summary": {
    "total_windows": 25,
    "total_duration_minutes": 287.5,
    "coverage_efficiency": 1.06,
    "satellites_tracked": 3,
    "ground_stations": 4
  },
  "windows": [ ... ],
  "orbital_predictions": { ... },
  "status": "success"
}
```

---

## 📡 Live Data

### `POST /api/satellites/live-data`
Fetch live TLE data for satellites

**Request Body:**
```json
{
  "satellites": ["ISS (ZARYA)", "NOAA-18", "TERRA"]
}
```

**Response:**
```json
{
  "live_data": {
    "ISS (ZARYA)": {
      "line1": "1 25544U 98067A   25247.12345678 ...",
      "line2": "2 25544  51.6400 123.4567 ...",
      "fetch_time": "2025-09-04T12:00:00Z"
    }
  },
  "updated_satellites": ["ISS (ZARYA)"],
  "status": "success"
}
```

---

## 🚨 Error Handling

All endpoints return structured error responses:

```json
{
  "error": "Satellite 'UNKNOWN' not found",
  "status": "error"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing parameters, invalid data)
- `404` - Not Found (satellite, ground station not found)
- `500` - Internal Server Error

---

## 📋 Example Usage Scenarios

### 1. Track ISS in Real-Time
```bash
# Get current ISS position
curl "http://localhost:5000/api/satellites/ISS%20(ZARYA)/position"

# Get ISS trajectory for next 6 hours
curl "http://localhost:5000/api/satellites/ISS%20(ZARYA)/trajectory?duration_hours=6"
```

### 2. Find Communication Windows
```bash
# Find all windows for next 24 hours
curl "http://localhost:5000/api/communication-windows?duration_hours=24"

# Find windows for specific satellite-station pair
curl "http://localhost:5000/api/communication-windows?satellite=ISS%20(ZARYA)&station=ISRO%20Bangalore"
```

### 3. Add Custom Satellite
```bash
curl -X POST "http://localhost:5000/api/satellites" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Sat",
    "line1": "1 12345U 98067A   25247.12345678 -.00000123  00000-0  12345-4 0  9990",
    "line2": "2 12345  51.6400 123.4567 0001234  12.3456 347.6789 15.12345678123456"
  }'
```

### 4. Run Full Simulation
```bash
curl -X POST "http://localhost:5000/api/simulation/run" \
  -H "Content-Type: application/json" \
  -d '{
    "duration_hours": 12,
    "start_time": "2025-09-04T12:00:00Z"
  }'
```

---

## 🔧 Development Notes

### Frontend Integration
- All responses include CORS headers for web frontend
- Timestamps are in ISO format with UTC timezone
- JSON responses are structured consistently
- Error handling is standardized

### Performance Considerations
- Trajectory calculations can be expensive for long time periods
- Consider caching for frequently requested satellites
- Batch operations when possible
- Monitor memory usage for large simulations

### Future Enhancements
- WebSocket support for real-time updates
- Authentication and API key management
- Rate limiting for production deployment
- Database integration for persistent storage
- GraphQL endpoint for flexible queries

---

## 📞 Support

**Project:** ISRO SIH 2025 Problem Statement #25142  
**Team:** Project Astraeus  
**Component:** Sub-Phase 1.2 - API Layer  
**Status:** ✅ COMPLETE

For technical issues or feature requests, refer to the project documentation or submit an issue through the development workflow.
