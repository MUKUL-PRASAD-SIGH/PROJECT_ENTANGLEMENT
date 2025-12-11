# Backend - Digital Twin & AI Engine

This directory contains the Python-based backend for Project Astraeus. It serves as the core engine for satellite tracking, orbital simulation, and AI-driven scheduling.

## Core Components

*   **`api_server.py`**: The main Flask REST API server (Port 5000). Handles requests for satellite data, scheduling, and simulation control.
*   **`websocket_server.py`**: Handles real-time bi-directional communication (Port 5001) for live satellite positions and status updates.
*   **`orbital_simulator.py`**: Physics engine using `Skyfield` to calculate satellite orbits, positions, and trajectories.
*   **`satellite_tracker.py`**: Real-time tracking module that interfaces with TLE (Two-Line Element) data.
*   **`communication_windows.py`**: Algorithms for calculating visibility windows between satellites and ground stations.
*   **`tle_fetcher.py`**: Utility to fetch the latest TLE data from Celestrak/NASA.
*   **`ai_performance.py`**: module for tracking and serving AI performance metrics.
*   **`database.py`**: Database interface for storing simulation results and user data.
*   **`proxy_server.py`**: Proxy server configuration (if applicable).

## Setup & Running

1.  **Install Dependencies:**
    Ensure you are in the project root or backend directory.
    ```bash
    pip install -r requirements.txt
    ```

2.  **Start the Server:**
    ```bash
    python api_server.py
    ```
    This will typically start the Flask server on `http://localhost:5000`.

## Architecture
The backend follows a modular architecture where the API layer (`api_server.py`) delegates complex logic to specialized modules (`orbital_simulator`, `ai_performance`). Real-time data is pushed via WebSockets to connected clients.
