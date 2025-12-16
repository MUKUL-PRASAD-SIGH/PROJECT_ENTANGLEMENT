# Project Entanglement - Problems & Challenges Log

This document serves as a historical record of technical hurdles encountered during development, their solutions, and current ongoing challenges. It is intended to aid future developers in understanding the codebase's evolution and potential pitfalls.

## 🛠️ Resolved Technical Issues

### 1. JSON Serialization in Simulation Endpoint
*   **Issue**: The `POST /api/simulation/run` endpoint failed with a 500 Internal Server Error during integration testing.
*   **Context**: The simulation engine uses **NumPy** for high-performance orbital mechanics calculations.
*   **Root Cause**: NumPy arrays (`ndarray`) are not natively serializable by Python's standard `json` library. The `json.dumps()` method failed when attempting to return the simulation results directly.
*   **Solution**: Implemented a recursive conversion utility to transform all NumPy data structures into standard Python lists/floats before response generation.
*   **Status**: ✅ **FIXED** (Verified in `docs/api/API_TEST_RESULTS.md`)

### 2. Communication Window Data Discrepancy
*   **Issue**: The frontend `CommunicationWindows` component occasionally displayed empty or malformed data despite the backend reporting success.
*   **Context**: Real-time window detection algorithm.
*   **Root Cause**: The Python `CommunicationWindow` object structure did not perfectly match the JSON schema expected by the React component (specifically date formatting and field casing).
*   **Solution**: Standardized the API response format in `api_server.py` to ensure strict adherence to the JSON schema expected by the frontend. Added explicit ISO 8601 formatting for all timestamps.
*   **Status**: ✅ **FIXED** (Verified in `docs/status/PHASE_3_SUMMARY.md`)

### 3. AI Model Loading in Production
*   **Issue**: The system would crash on startup if trained model files (`policy.pth`) were missing from the directory.
*   **Context**: Integration of the Deep Reinforcement Learning (PPO) agent.
*   **Root Cause**: Hard dependency on local model files without a fallback mechanism.
*   **Solution**: Implemented a robust `AIModelManager` class. It now checks for the existence of model files on startup. If missing, it automatically degrades to a "Mock Mode," using heuristic-based performance estimation while alerting the user via the `system_status` WebSocket event.
*   **Status**: ✅ **FIXED** (Verified in `docs/status/LAST.md`)

---

## 🔄 Recent Changes & Associated Resolutions (Phase 6.1+)

### 1. Emergency System Reality Gap
*   **Problem**: Crisis management buttons (Wildfire Protocol, etc.) were purely cosmetic (Mock), giving a false sense of functionality during demos.
*   **Change**: Integrated `Emergency & Crisis Scenario` backend endpoints (`/api/emergency/activate`).
*   **Outcome**: Buttons now trigger real backend state changes and broadcast WebSocket events (`emergency_status`).

### 2. User Experience - Notification Blocking
*   **Problem**: The application relied on browser native `alert()` calls for feedback, which blocked the UI thread and looked unprofessional.
*   **Change**: Implemented a custom `NotificationSystem` component.
*   **Outcome**: Non-blocking, professional UI feedback for all actions (file exports, system errors, backend status).

### 3. Static Dashboard Metrics
*   **Problem**: The "Quick Status" section displayed hardcoded/mock values, failing to reflect the live state of the backend simulation.
*   **Change**: Connected Dashboard metrics to real-time API endpoints with periodic polling.
*   **Outcome**: "Satellites Tracked" and "System Health" now reflect live simulation data.

### 4. Lack of Environmental Context
*   **Problem**: Satellite operations were calculated in a vacuum without weather context.
*   **Change**: Added Weather Integration (`/api/weather/status`).
*   **Outcome**: Frontend now displays simulated real-time weather conditions affecting ground stations.

### 5. File Operation Reliability
*   **Problem**: Schedule exports and report generation were prone to silent failures.
*   **Change**: Connected file operations to backend endpoints with robust error handling.
*   **Outcome**: Users receive immediate feedback on success/failure of file operations.

---

## 🚧 Ongoing Integration Challenges

### 1. The "Mock to Real" Data Gap
*   **Context**: The project operates as a hybrid, using real orbital data (via Skyfield/Celestrak) but relying on mock data for specific subsystem telemetry (e.g., satellite battery thermal levels, specific sensor payloads) where public APIs do not exist.
*   **Challenge**: Creating a seamless user experience that doesn't feel "fake" despite missing some real-world inputs.
*   **Strategy**:
    *   **Identified Gaps**: Documented in `docs/planning/MOCK_TO_REAL_ROADMAP.md`.
    *   **Mitigation**: Using physics-based approximation models (e.g., calculating battery drain based on orbital eclipse time) rather than static hardcoded values, making the "mock" data behave realistically.

### 2. Real-Time WebSocket Synchronization
*   **Context**: Syncing the 3D CesiumJS globe (Frontend) with the Python orbital propagator (Backend).
*   **Challenge**: Network latency causes "jumping" satellites if the frontend strictly adheres to backend updates every 10 seconds.
*   **Solution (In Progress)**: Implementing client-side interpolation (using `satellite.js` on the frontend) to smooth movement between backend updates. The backend provides the "truth" anchor, while the frontend handles high-framerate interpolation.

---

## 🔮 Future Technical Hurdles

### 1. Graph Neural Network (GNN) Scalability
*   **Challenge**: Integrating `PyTorch Geometric` for real-time inference.
*   **Detail**: Constructing a graph of 100+ satellites and 50+ ground stations, calculating edge weights (communication links), and running inference must happen in <1 second to be useful for real-time scheduling.
*   **Risk**: Python's Global Interpreter Lock (GIL) could become a bottleneck during graph construction.
*   **Proposed Mitigation**: Move graph construction to a dedicated C++ extension or use a separate microservice for the AI inference engine.

### 2. Weather Data Integration
*   **Challenge**: Real-time link budget calculations require accurate local weather data (rain attenuation) at ground stations.
*   **Detail**: Free weather APIs often have rate limits or lack the specific atmospheric attenuation data needed for Ka-band/Ku-band modeling.
*   **Plan**: Implement caching and interpolation for weather data to minimize API calls while maintaining acceptable accuracy.