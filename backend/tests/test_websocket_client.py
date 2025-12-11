"""
WebSocket Client Test Script
Test the real-time satellite tracking WebSocket server

This script demonstrates how to connect to the WebSocket server
and receive real-time satellite updates.
"""

import socketio
import time
import json
from datetime import datetime

def test_websocket_client():
    """Test client for WebSocket server"""
    
    # Create SocketIO client
    sio = socketio.Client()
    
    # Event handlers
    @sio.event
    def connect():
        print("🔗 Connected to WebSocket server")
        print(f"📅 Connection time: {datetime.utcnow().isoformat()}Z")
    
    @sio.event
    def disconnect():
        print("❌ Disconnected from server")
    
    @sio.event
    def server_status(data):
        print(f"📊 Server Status: {json.dumps(data, indent=2)}")
        
        # Subscribe to satellite updates
        print("🛰️ Subscribing to satellite position updates...")
        sio.emit('subscribe_satellites', {})
    
    @sio.event
    def satellite_update(data):
        print(f"\n🛰️ Satellite Update at {data['timestamp']}:")
        for satellite in data['satellites']:
            pos = satellite['position']
            print(f"   {satellite['name']}: "
                  f"{pos['latitude']:.3f}°N, "
                  f"{pos['longitude']:.3f}°E, "
                  f"{pos['altitude_km']:.1f}km")
    
    @sio.event
    def window_update(data):
        print(f"\n📡 Communication Windows at {data['timestamp']}:")
        for window in data['windows'][:3]:  # Show first 3
            print(f"   {window['satellite']} → {window['ground_station']}: "
                  f"{window['duration_minutes']:.1f}min, "
                  f"{window['max_elevation']:.1f}°")
    
    @sio.event
    def system_metrics(data):
        print(f"📈 System: {data['connected_clients']} clients, "
              f"{data['satellite_subscribers']} sat subscribers")
    
    @sio.event
    def error(data):
        print(f"❌ Error: {data['message']}")
    
    try:
        print("🛰️ Project Entanglement - WebSocket Client Test")
        print("📡 Connecting to ws://localhost:5001...")
        
        # Connect to server
        sio.connect('http://localhost:5001')
        
        # Keep connection alive and listen for updates
        print("✅ Connected! Listening for real-time updates...")
        print("Press Ctrl+C to disconnect\n")
        
        # Wait for updates
        sio.wait()
        
    except KeyboardInterrupt:
        print("\n👋 Disconnecting...")
        sio.disconnect()
    except Exception as e:
        print(f"❌ Connection error: {e}")
        print("Make sure the WebSocket server is running on port 5001")

if __name__ == '__main__':
    test_websocket_client()
