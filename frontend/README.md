# Frontend - Mission Control Interface

This directory contains the React-based frontend for Project Astraeus. It provides a professional, "Mission Control" style interface for visualizing satellite data, managing schedules, and viewing AI analytics.

## Technology Stack

*   **React**: UI Framework.
*   **CesiumJS**: High-fidelity 3D globe visualization.
*   **Socket.IO Client**: Real-time data streaming from the backend.
*   **D3.js / Chart.js**: Data visualization for analytics.

## Directory Structure

*   **`public/`**: Static assets (index.html, Cesium assets).
*   **`src/components/`**: Reusable UI components.
    *   `LiveSatelliteTracker.js`: 3D Globe integration.
    *   `CommunicationWindows.js`: Lists active comms windows.
    *   `AIScheduler.js`: Interface for the AI scheduling engine.
    *   `NetworkGraphVisualization.js`: Visualizes the satellite network topology.
    *   ...and more.
*   **`src/pages/`**: Main application views (Dashboard, Satellites, Schedule, Analytics).
*   **`src/services/`**: API and WebSocket communication logic.

## Setup & Running

1.  **Install Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm start
    ```
    The application will open at `http://localhost:3000`.
