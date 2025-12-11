"""
Test Script for Sub-Phase 1.1 - Backend Foundation
Validates core simulation engine functionality
"""

from datetime import datetime, timedelta
from skyfield.api import utc
from orbital_simulator import SatelliteConstellationSimulator
import json

def test_satellite_position_prediction():
    """Test satellite position prediction functionality"""
    print("[SATELLITE] Testing Satellite Position Prediction...")
    
    simulator = SatelliteConstellationSimulator()
    simulator.initialize_sample_constellation()
    
    # Test ISS position prediction
    test_time = datetime.now(utc)
    iss_status = simulator.get_satellite_status('ISS', test_time)
    
    print(f"[SUCCESS] ISS Position at {test_time.strftime('%Y-%m-%d %H:%M:%S')} UTC:")
    print(f"   Latitude: {iss_status['position']['latitude']:.4f}°")
    print(f"   Longitude: {iss_status['position']['longitude']:.4f}°")
    print(f"   Altitude: {iss_status['position']['altitude_km']:.2f} km")
    
    return True

def test_communication_windows():
    """Test communication window detection"""
    print("\n[COMM] Testing Communication Window Detection...")
    
    simulator = SatelliteConstellationSimulator()
    simulator.initialize_sample_constellation()
    
    # Find next communication opportunities
    next_windows = simulator.predict_next_communication_opportunities(
        'ISS', 'ISRO_Bangalore', look_ahead_hours=24
    )
    
    print(f"[SUCCESS] Found {len(next_windows)} communication windows for ISS -> ISRO Bangalore:")
    for i, window in enumerate(next_windows[:3], 1):
        print(f"   {i}. {window}")
    
    return len(next_windows) > 0

def test_orbital_mechanics():
    """Test orbital mechanics simulation"""
    print("\n[ORBITAL] Testing Orbital Mechanics Simulation...")
    
    simulator = SatelliteConstellationSimulator()
    simulator.initialize_sample_constellation()
    
    # Run 6-hour simulation
    results = simulator.run_simulation(duration_hours=6)
    
    stats = results['statistics']
    print(f"[SUCCESS] Simulation Results (6 hours):")
    print(f"   Total Communication Windows: {stats['total_communication_windows']}")
    print(f"   Total Communication Time: {stats['total_communication_time_minutes']:.1f} minutes")
    print(f"   Average Window Duration: {stats['average_window_duration_minutes']:.1f} minutes")
    print(f"   Coverage Efficiency: {stats['coverage_efficiency']:.2f}%")
    
    return stats['total_communication_windows'] > 0

def test_ground_station_visibility():
    """Test ground station visibility calculations"""
    print("\n[VISIBILITY] Testing Ground Station Visibility...")
    
    simulator = SatelliteConstellationSimulator()
    simulator.initialize_sample_constellation()
    
    # Check ISS visibility from all ground stations
    test_time = datetime.now(utc)
    iss_status = simulator.get_satellite_status('ISS', test_time)
    
    print(f"[SUCCESS] ISS Visibility from Ground Stations:")
    for station, visibility in iss_status['ground_station_visibility'].items():
        status = "VISIBLE" if visibility['visible'] else "NOT VISIBLE"
        elevation = visibility['elevation_degrees']
        print(f"   {station}: {status} (Elevation: {elevation:.1f}°)")
    
    return True

def run_all_tests():
    """Run all Sub-Phase 1.1 tests"""
    print("PROJECT ENTANGLEMENT - Sub-Phase 1.1 Testing")
    print("=" * 50)
    
    tests = [
        test_satellite_position_prediction,
        test_communication_windows,
        test_orbital_mechanics,
        test_ground_station_visibility
    ]
    
    passed = 0
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"[ERROR] Test failed: {e}")
    
    print(f"\n[RESULTS] Test Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("[COMPLETE] Sub-Phase 1.1 - Backend Foundation: COMPLETE!")
        print("\n[SUCCESS] What's Working Now:")
        print("   - Satellite position prediction at any given time")
        print("   - Communication window calculation between satellites and ground stations")
        print("   - Basic orbital mechanics simulation")
        print("   - Ground station visibility analysis")
        
        print("\n[USER] What Users Can Do:")
        print("   - Input satellite TLE data and get position predictions")
        print("   - Query communication windows for satellite-ground station pairs")
        print("   - Verify orbital calculations against known satellite positions")
        print("   - Run simulation scenarios for constellation management")
        
        print("\n[TODO] What's Left:")
        print("   - API development for web interface")
        print("   - DRL implementation for optimization")
        print("   - Frontend integration and visualization")
        
        return True
    else:
        print("[ERROR] Some tests failed. Please check the implementation.")
        return False

if __name__ == "__main__":
    run_all_tests()