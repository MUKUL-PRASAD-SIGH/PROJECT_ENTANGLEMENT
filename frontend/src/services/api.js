/**
 * API Service Layer for Project Astraeus
 * Handles REST API calls and WebSocket connections to the Digital Twin backend
 */

import axios from 'axios';
import io from 'socket.io-client';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.socket = null;
  }

  // ========================
  // WebSocket Connection
  // ========================

  /**
   * Initialize WebSocket connection for real-time updates
   */
  initializeWebSocket() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io('http://localhost:5000');

    this.socket.on('connect', () => {
      console.log('✅ Connected to Digital Twin backend');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from Digital Twin backend');
    });

    this.socket.on('error', (error) => {
      console.error('🔌 WebSocket error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isWebSocketConnected() {
    return this.socket && this.socket.connected;
  }

  /**
   * Alias for initializeWebSocket (backward compatibility)
   */
  connectWebSocket() {
    return this.initializeWebSocket();
  }

  // ========================
  // Satellite Endpoints
  // ========================

  /**
   * Get all satellites
   */
  async getSatellites() {
    try {
      const response = await axios.get(`${this.baseURL}/satellites`);
      return response.data;
    } catch (error) {
      console.error('Error fetching satellites:', error);
      throw error;
    }
  }

  /**
   * Add new satellite to tracking system
   */
  async addSatellite(satelliteData) {
    try {
      const response = await axios.post(`${this.baseURL}/satellites`, satelliteData);
      return response.data;
    } catch (error) {
      console.error('Error adding satellite:', error);
      throw error;
    }
  }

  /**
   * Get satellite position at specific time
   */
  async getSatellitePosition(name, time = null) {
    try {
      const url = time 
        ? `${this.baseURL}/satellites/${name}/position?time=${time}`
        : `${this.baseURL}/satellites/${name}/position`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching satellite position:', error);
      throw error;
    }
  }

  /**
   * Get satellite trajectory
   */
  async getSatelliteTrajectory(name, duration = 24, step = 5) {
    try {
      const response = await axios.get(
        `${this.baseURL}/satellites/${name}/trajectory?duration_hours=${duration}&step_minutes=${step}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching satellite trajectory:', error);
      throw error;
    }
  }

  /**
   * Get CZML data for Cesium visualization
   */
  async getCZMLData(duration = 24, step = 5) {
    try {
      const response = await axios.get(
        `${this.baseURL}/satellites/czml?duration_hours=${duration}&step_minutes=${step}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching CZML data:', error);
      throw error;
    }
  }

  /**
   * Update live satellite data
   */
  async updateLiveData() {
    try {
      const response = await axios.post(`${this.baseURL}/satellites/live-data`);
      return response.data;
    } catch (error) {
      console.error('Error updating live data:', error);
      throw error;
    }
  }

  // ========================
  // Ground Station Endpoints
  // ========================

  /**
   * Get all ground stations
   */
  async getGroundStations() {
    try {
      const response = await axios.get(`${this.baseURL}/ground-stations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ground stations:', error);
      throw error;
    }
  }

  /**
   * Add new ground station
   */
  async addGroundStation(stationData) {
    try {
      const response = await axios.post(`${this.baseURL}/ground-stations`, stationData);
      return response.data;
    } catch (error) {
      console.error('Error adding ground station:', error);
      throw error;
    }
  }

  /**
   * Get AI performance comparison
   */
  async getAIPerformance() {
    try {
      const response = await axios.get(`${this.baseURL}/ai/performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching AI performance:', error);
      throw error;
    }
  }

  /**
   * Optimize schedule using AI model
   */
  async optimizeScheduleWithAI(params = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/ai/schedule`, params);
      return response.data;
    } catch (error) {
      console.error('Error optimizing schedule with AI:', error);
      throw error;
    }
  }

  /**
   * Get AI model information
   */
  async getModelInfo() {
    try {
      const response = await axios.get(`${this.baseURL}/ai/model-info`);
      return response.data;
    } catch (error) {
      console.error('Error fetching model info:', error);
      throw error;
    }
  }

  /**
   * Get optimization history with real training results
   */
  async getOptimizationHistory() {
    try {
      const response = await axios.get(`${this.baseURL}/optimization/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching optimization history:', error);
      throw error;
    }
  }

  /**
   * Save optimization entry to history
   */
  async saveOptimizationEntry(entry) {
    try {
      const response = await axios.post(`${this.baseURL}/optimization/history`, entry);
      return response.data;
    } catch (error) {
      console.error('Error saving optimization entry:', error);
      throw error;
    }
  }

  // ========================
  // Communication Windows
  // ========================

  /**
   * Get communication windows
   */
  async getCommunicationWindows(params = {}) {
    try {
      // Handle both object params and individual params for backward compatibility
      let duration, minElevation;
      
      if (typeof params === 'object' && params !== null) {
        duration = params.duration_hours || params.duration || 6;
        minElevation = params.min_elevation || params.minElevation || 10;
      } else {
        // Legacy support for individual parameters
        duration = arguments[0] || 6;
        minElevation = arguments[1] || 10;
      }
      
      const response = await axios.get(
        `${this.baseURL}/communication-windows?duration_hours=${duration}&min_elevation=${minElevation}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching communication windows:', error);
      throw error;
    }
  }

  /**
   * Get visibility data for satellites
   */
  async getVisibility(duration = 24) {
    try {
      const response = await axios.get(
        `${this.baseURL}/visibility?duration_hours=${duration}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching visibility data:', error);
      throw error;
    }
  }

  // ========================
  // Simulation Endpoints
  // ========================

  /**
   * Run simulation
   */
  async runSimulation(duration = 24, stepMinutes = 5) {
    try {
      const response = await axios.post(`${this.baseURL}/simulation/run`, {
        duration_hours: duration,
        step_minutes: stepMinutes
      });
      return response.data;
    } catch (error) {
      console.error('Error running simulation:', error);
      throw error;
    }
  }

  // ========================
  // Emergency & Control Endpoints
  // ========================

  /**
   * Activate emergency override mode
   */
  async activateEmergency(emergencyType = 'general') {
    try {
      const response = await axios.post(`${this.baseURL}/emergency/activate`, {
        type: emergencyType
      });
      return response.data;
    } catch (error) {
      console.error('Error activating emergency:', error);
      throw error;
    }
  }

  /**
   * Get current weather conditions for satellite operations
   */
  async getWeatherStatus() {
    try {
      const response = await axios.get(`${this.baseURL}/weather/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather status:', error);
      throw error;
    }
  }

  /**
   * Configure satellite parameters
   */
  async configureSatellite(satelliteName, configType, parameters) {
    try {
      const response = await axios.post(`${this.baseURL}/satellites/${satelliteName}/configure`, {
        config_type: configType,
        parameters: parameters
      });
      return response.data;
    } catch (error) {
      console.error('Error configuring satellite:', error);
      throw error;
    }
  }

  /**
   * Optimize satellite scheduling
   */
  async optimizeSchedule(criteria = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/optimization/schedule`, criteria);
      return response.data;
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      throw error;
    }
  }

  /**
   * Export schedule in various formats
   */
  async exportSchedule(format = 'json', timeRange = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/schedule/export`, {
        params: { format, ...timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting schedule:', error);
      throw error;
    }
  }

  /**
   * Track specific satellite
   */
  async trackSatellite(satelliteName, trackingMode = 'auto') {
    try {
      const response = await axios.post(`${this.baseURL}/satellites/${satelliteName}/track`, {
        mode: trackingMode
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking satellite:', error);
      throw error;
    }
  }

  /**
   * Update system configuration
   */
  async updateConfiguration(configData) {
    try {
      const response = await axios.post(`${this.baseURL}/config/update`, configData);
      return response.data;
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  }

  // ========================
  // Helper Methods
  // ========================

  /**
   * Health check endpoint
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus() {
    try {
      const response = await axios.get(`${this.baseURL}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  }

  // ========================
  // File Operations & Data Management
  // ========================

  /**
   * Export schedule data
   */
  async exportSchedule(format = 'json', range = '24h') {
    try {
      const response = await axios.get(`${this.baseURL}/files/schedules/export`, {
        params: { format, range }
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting schedule:', error);
      throw error;
    }
  }

  /**
   * Import schedule data from file
   */
  async importSchedule(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${this.baseURL}/files/schedules/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing schedule:', error);
      throw error;
    }
  }

  /**
   * Export satellite TLE data
   */
  async exportSatelliteData(format = 'tle') {
    try {
      const response = await axios.get(`${this.baseURL}/files/satellites/export`, {
        params: { format }
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting satellite data:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive mission report
   */
  async generateReport(type = 'summary', period = '24h') {
    try {
      const response = await axios.post(`${this.baseURL}/files/reports/generate`, {
        type, period
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
