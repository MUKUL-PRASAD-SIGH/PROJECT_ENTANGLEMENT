# Backend Tests

This directory contains the test suite for the Project Astraeus backend.

## Test Files

*   **`test_api.py`**: Tests for the Flask REST API endpoints (GET/POST requests, error handling).
*   **`test_simulation.py`**: Tests for the orbital mechanics calculations and simulation logic.
*   **`test_websocket_client.py`**: Client-side script to test WebSocket connectivity and data streaming.
*   **`websocket_test.html`**: A simple HTML file to manually test WebSocket connections in a browser.

## Running Tests

You can run the tests using `pytest` or Python's built-in `unittest`.

**Using Unittest:**
```bash
# Run from the project root
python -m unittest discover backend/tests
```

**Using Pytest (Recommended):**
```bash
pytest backend/tests
```
