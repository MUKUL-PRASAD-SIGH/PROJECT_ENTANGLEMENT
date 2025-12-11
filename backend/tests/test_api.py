"""
Quick test script to check if our backend modules import correctly
"""

try:
    print("Testing imports...")
    
    from satellite_tracker import SatelliteTracker, SAMPLE_TLE_DATA, SAMPLE_GROUND_STATIONS
    print("✅ satellite_tracker imported successfully")
    
    from communication_windows import CommunicationWindowDetector, CommunicationWindow
    print("✅ communication_windows imported successfully")
    
    from orbital_simulator import SatelliteConstellationSimulator
    print("✅ orbital_simulator imported successfully")
    
    from tle_fetcher import TLEFetcher
    print("✅ tle_fetcher imported successfully")
    
    print("\n🚀 All imports successful! Testing basic functionality...")
    
    # Test basic functionality
    tracker = SatelliteTracker()
    print("✅ SatelliteTracker created")
    
    simulator = SatelliteConstellationSimulator()
    print("✅ SatelliteConstellationSimulator created")
    
    print("\n🎯 Backend modules are working correctly!")
    
except Exception as e:
    print(f"❌ Error importing modules: {e}")
    import traceback
    traceback.print_exc()
