"""
Test AI Integration for Project Astraeus
This script tests all AI integration components
"""

import requests
import json
import time
import sys
import os

def test_backend_health():
    """Test if backend server is running"""
    try:
        response = requests.get("http://localhost:5000/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running")
            return True
        else:
            print(f"❌ Backend server returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend server not accessible: {e}")
        return False

def test_ai_endpoints():
    """Test AI-specific endpoints"""
    base_url = "http://localhost:5000/api"
    
    tests = [
        ("AI Performance", f"{base_url}/ai/performance"),
        ("AI Model Info", f"{base_url}/ai/model-info"),
    ]
    
    results = []
    for test_name, url in tests:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {test_name}: OK")
                results.append((test_name, True, data))
            else:
                print(f"❌ {test_name}: HTTP {response.status_code}")
                results.append((test_name, False, None))
        except Exception as e:
            print(f"❌ {test_name}: {e}")
            results.append((test_name, False, None))
    
    return results

def test_ai_scheduling():
    """Test AI scheduling endpoint"""
    try:
        url = "http://localhost:5000/api/ai/schedule"
        data = {"duration_hours": 6}
        
        response = requests.post(url, json=data, timeout=15)
        if response.status_code == 200:
            result = response.json()
            print("✅ AI Scheduling: OK")
            print(f"   • Method: {result.get('ai_schedule', {}).get('optimization_method', 'Unknown')}")
            print(f"   • Confidence: {result.get('ai_schedule', {}).get('ai_confidence', 0) * 100:.1f}%")
            print(f"   • Performance Gain: +{result.get('ai_schedule', {}).get('performance_gain', 0)}%")
            return True
        else:
            print(f"❌ AI Scheduling: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ AI Scheduling: {e}")
        return False

def test_model_files():
    """Test if model files exist"""
    model_dir = "model&datareq"
    files_to_check = [
        "training_scenarios.pkl",
        "model_info.json"
    ]
    
    print("\n📁 Checking model files:")
    for filename in files_to_check:
        filepath = os.path.join(model_dir, filename)
        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            print(f"✅ {filename}: {size:,} bytes")
        else:
            print(f"❌ {filename}: Not found")

def display_performance_data(results):
    """Display AI performance data"""
    print("\n📊 AI Performance Data:")
    for test_name, success, data in results:
        if success and data and test_name == "AI Performance":
            perf_data = data.get('performance_comparison', {})
            ai_perf = perf_data.get('ai_performance', {})
            classical_perf = perf_data.get('classical_performance', {})
            improvements = perf_data.get('improvements', {})
            
            print(f"   🤖 AI Performance:")
            print(f"      • Efficiency: {ai_perf.get('efficiency', 0):.1f}%")
            print(f"      • Throughput: {ai_perf.get('throughput_mbps', 0)} Mbps")
            print(f"      • Latency: {ai_perf.get('latency_ms', 0)}ms")
            print(f"      • Success Rate: {ai_perf.get('success_rate', 0):.1f}%")
            
            print(f"   📊 Classical Performance:")
            print(f"      • Efficiency: {classical_perf.get('efficiency', 0):.1f}%")
            print(f"      • Throughput: {classical_perf.get('throughput_mbps', 0)} Mbps")
            print(f"      • Latency: {classical_perf.get('latency_ms', 0)}ms")
            print(f"      • Success Rate: {classical_perf.get('success_rate', 0):.1f}%")
            
            print(f"   ⚡ Improvements:")
            print(f"      • Efficiency: +{improvements.get('efficiency_improvement', 0):.1f}%")
            print(f"      • Throughput: +{improvements.get('throughput_improvement', 0)} Mbps")
            print(f"      • Latency: {improvements.get('latency_improvement', 0)}ms")
            print(f"      • Success Rate: +{improvements.get('success_rate_improvement', 0):.1f}%")

def main():
    print("🤖 Testing AI Integration for Project Astraeus")
    print("=" * 60)
    
    # Test backend health
    if not test_backend_health():
        print("\n❌ Backend server is not running!")
        print("Please start the backend server first:")
        print("   python backend/api_server.py")
        return False
    
    print()
    
    # Test model files
    test_model_files()
    
    print("\n🔌 Testing AI Endpoints:")
    results = test_ai_endpoints()
    
    print("\n🚀 Testing AI Scheduling:")
    scheduling_works = test_ai_scheduling()
    
    # Display performance data
    display_performance_data(results)
    
    print("\n" + "=" * 60)
    
    # Summary
    endpoint_success = sum(1 for _, success, _ in results if success)
    total_tests = len(results) + 1  # +1 for scheduling test
    successful_tests = endpoint_success + (1 if scheduling_works else 0)
    
    print(f"📊 Test Summary: {successful_tests}/{total_tests} tests passed")
    
    if successful_tests == total_tests:
        print("🎉 All AI integration tests passed!")
        print("\n✅ What's working:")
        print("   • AI performance comparison")
        print("   • AI model information")
        print("   • AI-powered scheduling")
        print("   • Mock training data")
        
        print("\n🚀 Next steps:")
        print("   1. Start frontend: cd frontend && npm start")
        print("   2. Visit: http://localhost:3000/schedule")
        print("   3. Click 'RUN AI OPTIMIZATION' to see AI in action")
        print("   4. Check Analytics page for performance comparison")
        
    else:
        print("⚠️ Some tests failed. Check the backend server and try again.")
    
    return successful_tests == total_tests

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)