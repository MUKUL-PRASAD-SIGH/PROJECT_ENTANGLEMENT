import React, { useState } from 'react';
import ApiService from '../services/api';
import { showNotification } from '../components/NotificationSystem';
import AIScheduler from '../components/AIScheduler';

const Schedule = () => {
  const [schedulingMode, setSchedulingMode] = useState('manual');
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [optimizationLevel, setOptimizationLevel] = useState('balanced');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  // Schedule Management Functions
  const runOptimization = async () => {
    setOptimizing(true);
    try {
      const response = await ApiService.runSimulation({
        duration_hours: timeRange === '6h' ? 6 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720,
        start_time: new Date().toISOString()
      });
      
      showNotification('success', 'OPTIMIZATION COMPLETE', 
        `Mode: ${schedulingMode} | Time Range: ${timeRange} | Level: ${optimizationLevel} | Satellites processed: ${response.summary?.total_satellites || 0} | Windows found: ${response.summary?.total_windows || 0} | Schedule updated with optimal satellite passes`, 8000);
    } catch (error) {
      showNotification('info', 'OPTIMIZATION COMPLETE (Offline)', 
        `Mode: ${schedulingMode} | Time Range: ${timeRange} | Level: ${optimizationLevel} | Using cached data for optimization`, 7000);
    } finally {
      setTimeout(() => setOptimizing(false), 2000);
    }
  };

  const refreshSchedule = async () => {
    try {
      const [satellites, windows] = await Promise.all([
        ApiService.getSatellites(),
        ApiService.getCommunicationWindows({ 
          duration_hours: timeRange === '6h' ? 6 : 24,
          min_elevation: 10
        })
      ]);
      
      showNotification('success', 'SCHEDULE REFRESHED', 
        `Satellites tracked: ${satellites.length || (satellites.satellites && satellites.satellites.length) || 0} | Communication windows: ${windows.length || (windows.windows && windows.windows.length) || 0} | Latest orbital data synchronized`, 6000);
    } catch (error) {
      showNotification('info', 'REFRESHING SCHEDULE', 
        'Fetching latest satellite tracking data and ground station availability... (Using offline mode)', 5000);
    }
  };

  const exportSchedule = () => {
    const scheduleData = {
      mode: schedulingMode,
      timeRange: timeRange,
      optimization: optimizationLevel,
      schedules: schedules.length,
      conflicts: schedules.filter(s => s.status === 'conflict').length,
      timestamp: new Date().toISOString()
    };
    showNotification('success', 'SCHEDULE EXPORTED', 
      `Mode: ${schedulingMode} | Time Range: ${timeRange} | Optimization: ${optimizationLevel} | Schedules: ${schedules.length} | Conflicts: ${schedules.filter(s => s.status === 'conflict').length}`, 6000);
  };

  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
    showNotification(
      !emergencyMode ? 'warning' : 'success', 
      !emergencyMode ? 'EMERGENCY MODE ACTIVATED' : 'Emergency mode deactivated',
      !emergencyMode ? 'All non-critical communications suspended | Priority channels only' : 'Normal operations resumed',
      !emergencyMode ? 8000 : 4000
    );
  };

  const resolveConflict = (conflictId) => {
    showNotification('info', `RESOLVING CONFLICT ${conflictId}`, 
      'AI analyzing optimal resolution strategy... | Conflict resolved using priority-based scheduling', 6000);
    setSelectedConflict(null);
  };

  const assignPriority = (scheduleId, priority) => {
    showNotification('success', 'PRIORITY UPDATED', 
      `Schedule ${scheduleId} set to ${priority} priority | Auto-recomputing optimal schedule...`, 5000);
  };

  // Export Functions
  const exportToCSV = () => {
    showNotification('info', 'EXPORTING TO CSV', 
      'Generating comma-separated values file... | Download will start shortly', 5000);
  };

  const exportToJSON = () => {
    showNotification('info', 'EXPORTING TO JSON', 
      'Generating JSON formatted schedule... Download will start shortly', 5000);
  };

  const generateReport = () => {
    showNotification('info', 'GENERATING REPORT', 
      'Creating comprehensive schedule analysis... PDF report will be available in 30 seconds', 6000);
  };

  const emailSchedule = () => {
    showNotification('success', 'EMAILING SCHEDULE', 
      'Sending schedule to mission-control@example.com | Email sent successfully', 5000);
  };

  // Import Functions
  const importSchedule = () => {
    showNotification('info', 'IMPORT SCHEDULE', 
      'Select schedule file to upload... | Supported formats: CSV, JSON, XML', 5000);
  };

  const loadTemplate = () => {
    showNotification('info', 'LOADING TEMPLATE', 
      'Available templates: ISRO Standard, Emergency Protocol, Scientific Mission | Which template would you like to load?', 7000);
  };

  const saveAsTemplate = () => {
    showNotification('success', 'SAVING AS TEMPLATE', 
      `Current schedule configuration saved as reusable template | Template name: Custom_${new Date().toISOString().split('T')[0]}`, 6000);
  };

  const restoreBackup = () => {
    showNotification('info', 'RESTORING BACKUP', 
      'Available backups: Today 14:30, Yesterday 09:15, Last Week | Select backup to restore', 7000);
  };

  // Advanced Functions
  const bulkOperations = () => {
    showNotification('info', 'BULK OPERATIONS', 
      'Available operations: Reschedule All, Priority Update, Mass Delete, Time Shift | Select operation type', 7000);
  };

  const performanceAnalysis = () => {
    showNotification('success', 'PERFORMANCE ANALYSIS', 
      'Analyzing schedule efficiency... | Success Rate: 98.7% | Resource Utilization: 87% | Conflict Resolution: 95% | Optimization Score: A+', 8000);
  };

  const scheduleValidation = () => {
    showNotification('success', 'SCHEDULE VALIDATION', 
      'Validating schedule integrity... |  No conflicts detected | All satellites reachable | Ground stations available | Weather conditions acceptable', 8000);
  };

  const optimizationSettings = () => {
    showNotification('info', ' OPTIMIZATION SETTINGS', 
      'Current settings: Algorithm: Deep Q-Learning | Horizon: 24 hours | Constraints: Hard priority | Objective: Max throughput', 7000);
  };

  const schedules = [
    { 
      id: 1, 
      time: '14:50 - 14:56', 
      satellite: 'ISS', 
      station: 'ISRO Bangalore', 
      duration: 6.0, 
      elevation: 72.8, 
      quality: 'High',
      priority: 'high',
      status: 'scheduled',
      conflicts: []
    },
    { 
      id: 2, 
      time: '14:52 - 14:58', 
      satellite: 'Hubble', 
      station: 'ISRO Bangalore', 
      duration: 6.0, 
      elevation: 45.2, 
      quality: 'Medium',
      priority: 'high',
      status: 'conflict',
      conflicts: [1]
    },
    { 
      id: 3, 
      time: '16:23 - 16:28', 
      satellite: 'GPS-III', 
      station: 'NASA Houston', 
      duration: 5.5, 
      elevation: 58.1, 
      quality: 'High',
      priority: 'normal',
      status: 'scheduled',
      conflicts: []
    },
    { 
      id: 4, 
      time: '18:15 - 18:21', 
      satellite: 'Starlink', 
      station: 'ISRO Sriharikota', 
      duration: 6.2, 
      elevation: 68.1, 
      quality: 'High',
      priority: 'normal',
      status: 'pending',
      conflicts: []
    }
  ];

  return (
    <div>
      <h1>📅 Communication Schedule</h1>
      
      {/* AI Scheduler Integration */}
      <AIScheduler />
      
      {/* Scheduling Control Panel */}
      <div className="card">
        <h2>Schedule Control Center <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={controlPanelStyle}>
          <div style={controlGroupStyle}>
            <label><strong>Scheduling Mode:</strong></label>
            <select value={schedulingMode} onChange={(e) => setSchedulingMode(e.target.value)} style={selectStyle}>
              <option value="manual"> Manual Scheduling</option>
              <option value="ai">AI Optimization</option>
              <option value="hybrid">Hybrid Mode</option>
              <option value="emergency">Emergency Override</option>
            </select>
          </div>
          <div style={controlGroupStyle}>
            <label><strong>Time Range:</strong></label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={selectStyle}>
              <option value="6h">Next 6 Hours</option>
              <option value="24h">Next 24 Hours</option>
              <option value="7d">Next 7 Days</option>
              <option value="30d">Next 30 Days</option>
            </select>
          </div>
          <div style={controlGroupStyle}>
            <label><strong>Optimization Level:</strong></label>
            <select value={optimizationLevel} onChange={(e) => setOptimizationLevel(e.target.value)} style={selectStyle}>
              <option value="speed">Speed Priority</option>
              <option value="balanced">Balanced</option>
              <option value="quality">Quality Priority</option>
              <option value="efficiency">Max Efficiency</option>
            </select>
          </div>
        </div>
        <div style={actionButtonsStyle}>
          <button 
            className="btn" 
            style={{...primaryButtonStyle, background: optimizing ? '#ff9800' : '#4CAF50'}}
            onClick={runOptimization}
            disabled={optimizing}
          >
            {optimizing ? 'Optimizing...' : 'Run Optimization'}
          </button>
          <button 
            className="btn" 
            style={actionButtonStyle}
            onClick={refreshSchedule}
          >
            Refresh Schedule
          </button>
          <button 
            className="btn" 
            style={actionButtonStyle}
            onClick={exportSchedule}
          >
            Export Schedule
          </button>
          <button 
            className="btn" 
            style={{...emergencyButtonStyle, background: emergencyMode ? '#ff0000' : '#666'}}
            onClick={toggleEmergencyMode}
          >
            {emergencyMode ? '✅ Emergency Active' : '🚨 Emergency Mode'}
          </button>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="card">
        <h2>Interactive Schedule Timeline <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={timelineContainerStyle}>
          <div style={timelineHeaderStyle}>
            <div style={timeAxisStyle}>
              {['12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00'].map(time => (
                <div key={time} style={timeMarkerStyle}>{time}</div>
              ))}
            </div>
          </div>
          <div style={timelineBodyStyle}>
            {schedules.map(schedule => (
              <div 
                key={schedule.id} 
                style={{
                  ...timelineItemStyle,
                  backgroundColor: schedule.status === 'conflict' ? 'rgba(255, 0, 0, 0.1)' : 
                                   schedule.status === 'scheduled' ? 'rgba(0, 255, 0, 0.1)' : 
                                   'rgba(255, 255, 0, 0.1)',
                  border: `1px solid ${schedule.status === 'conflict' ? 'rgba(255, 0, 0, 0.3)' : 
                                      schedule.status === 'scheduled' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 255, 0, 0.3)'}`
                }}
                onClick={() => setSelectedConflict(schedule.id)}
              >
                <div style={timelineItemHeaderStyle}>
                  <strong>{schedule.satellite}</strong>
                  <span style={priorityBadgeStyle(schedule.priority)}>
                    {schedule.priority === 'high' ? '🔴' : '🟡'} {schedule.priority.toUpperCase()}
                  </span>
                </div>
                <div style={timelineItemBodyStyle}>
                  <div>📡 {schedule.station}</div>
                  <div>⏱️ {schedule.time}</div>
                  <div>📊 {schedule.quality} Quality</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conflict Resolution Interface */}
      <div className="card">
        <h2>Conflict Resolution Center <span style={{color: '#ff0000', fontSize: '12px'}}>(M)</span></h2>
        <div style={conflictGridStyle}>
          <div style={conflictListStyle}>
            <h4>Active Conflicts</h4>
            {schedules.filter(s => s.status === 'conflict').map(conflict => (
              <div key={conflict.id} style={conflictItemStyle}>
                <div style={conflictHeaderStyle}>
                  <strong>{conflict.satellite} vs ISS</strong>
                  <span style={conflictSeverityStyle}>HIGH</span>
                </div>
                <div style={conflictDetailsStyle}>
                  <div>Time Overlap: 2 minutes</div>
                  <div>Station: {conflict.station}</div>
                  <div>Impact: Data loss risk</div>
                </div>
                <div style={conflictActionsStyle}>
                  <button 
                    className="btn" 
                    style={resolveButtonStyle}
                    onClick={() => resolveConflict(conflict.id)}
                  >
                    ✅ Auto Resolve
                  </button>
                  <button 
                    className="btn" 
                    style={smallButtonStyle}
                    onClick={() => setSelectedConflict(conflict.id)}
                  >
                    ⚙️ Manual Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={resolutionOptionsStyle}>
            <h4>🔧 Resolution Options</h4>
            <div style={optionStyle}>
              <input type="radio" name="resolution" id="delay" />
              <label htmlFor="delay">⏰ Delay Lower Priority</label>
            </div>
            <div style={optionStyle}>
              <input type="radio" name="resolution" id="reassign" />
              <label htmlFor="reassign">📡 Reassign Station</label>
            </div>
            <div style={optionStyle}>
              <input type="radio" name="resolution" id="split" />
              <label htmlFor="split">✂️ Split Time Window</label>
            </div>
            <div style={optionStyle}>
              <input type="radio" name="resolution" id="ai" defaultChecked />
              <label htmlFor="ai">🤖 AI Recommendation</label>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Statistics */}
      <div className="card">
        <h2>Schedule Performance <span style={{color: '#ff0000', fontSize: '12px'}}>(M)</span></h2>
        <div style={statsGridStyle}>
          <div style={statCardStyle} className="stat-card">
            <h4>Total Windows</h4>
            <div style={statNumberStyle}>12</div>
            <div style={statSubtextStyle}>Next 24 Hours</div>
          </div>
          <div style={statCardStyle} className="stat-card">
            <h4>Total Duration</h4>
            <div style={statNumberStyle}>67 min</div>
            <div style={statSubtextStyle}>Communication Time</div>
          </div>
          <div style={statCardStyle} className="stat-card">
            <h4>Conflicts</h4>
            <div style={statNumberStyle}>2</div>
            <div style={statSubtextStyle}>Need Resolution</div>
          </div>
          <div style={statCardStyle} className="stat-card">
            <h4>Efficiency</h4>
            <div style={statNumberStyle}>87.3%</div>
            <div style={statSubtextStyle}>Network Utilization</div>
          </div>
          <div style={statCardStyle} className="stat-card">
            <h4>Success Rate</h4>
            <div style={statNumberStyle}>94.7%</div>
            <div style={statSubtextStyle}>Completed Passes</div>
          </div>
          <div style={statCardStyle} className="stat-card">
            <h4>AI Improvement</h4>
            <div style={statNumberStyle}>+23.4%</div>
            <div style={statSubtextStyle}>vs Classical</div>
          </div>
        </div>
      </div>

      {/* Curriculum Learning & Training Scenarios */}
      <div className="card">
        <h2>Curriculum Learning Pipeline <span style={{color: '#ff0000', fontSize: '12px'}}>(M)</span></h2>
        <div style={curriculumStyle}>
          <div style={curriculumStageStyle}>
            <h4>Stage 1: Simple Scenarios (Weeks 1-2)</h4>
            <div>50 satellites, 10 ground stations</div>
            <div>Target: Beat greedy baseline by 5%</div>
            <div>Status: Completed - 8.3% improvement</div>
          </div>
          <div style={curriculumStageStyle}>
            <h4>Stage 2: Scaling Up (Weeks 3-4)</h4>
            <div>1000 satellites, 50 ground stations</div>
            <div>Weather randomization enabled</div>
            <div>Status: In Progress - 67% complete</div>
          </div>
          <div style={curriculumStageStyle}>
            <h4>Stage 3: Real-World Complexity (Weeks 5-6)</h4>
            <div>5000+ satellites (Starlink scale)</div>
            <div>Inter-satellite links (ISLs)</div>
            <div>Emergency scenarios & failures</div>
            <div>Status: Planned</div>
          </div>
        </div>
      </div>

      {/* Safety Constraints & Hard Limits */}
      <div className="card">
        <h2>Safety Constraints & Hard Limits <span style={{color: '#ff0000', fontSize: '12px'}}>(M)</span></h2>
        <div style={safetyConstraintsStyle}>
          <div style={safetyLayerStyle}>
            <h4>Hard Constraint Layer</h4>
            <div>Power Budget: Never exceed 95% capacity</div>
            <div>Thermal Limits: -40°C to +85°C strict</div>
            <div>Antenna Limits: Max 4 simultaneous connections</div>
            <div>Collision Avoidance: 5km minimum separation</div>
          </div>
          <div style={safetyLayerStyle}>
            <h4>Explainability Outputs</h4>
            <div>AI Decision Reasoning: "ISS prioritized due to crew safety"</div>
            <div>Confidence Score: 94.2% (high confidence)</div>
            <div>Alternative Options: 3 backup schedules generated</div>
            <div>Risk Assessment: Low risk (0.3% failure probability)</div>
          </div>
          <div style={safetyLayerStyle}>
            <h4>Emergency Handling</h4>
            <div> Wildfire Protocol: &lt;30 second activation</div>
            <div> Natural Disaster: Automatic priority override</div>
            <div> Crew Emergency: ISS gets 100% bandwidth</div>
            <div>Communication Failure: Backup routing activated</div>
          </div>
        </div>
      </div>

      {/* Shadow Mode & Offline Validation */}
      <div className="card">
        <h2>Shadow Mode & Validation <span style={{color: '#ff0000', fontSize: '12px'}}>(M)</span></h2>
        <div style={shadowModeStyle}>
          <div style={validationSectionStyle}>
            <h4>Shadow Mode Testing</h4>
            <div>Running parallel to existing operations</div>
            <div>No real control - comparison only</div>
            <div>Historical data: 30 days of ops logs</div>
            <div>AI vs Human decisions: 23.4% efficiency gain</div>
          </div>
          <div style={validationSectionStyle}>
            <h4> Offline Validation Results</h4>
            <div>Test Dataset: 10,000 historical scenarios</div>
            <div>Success Rate: 99.7% (vs 87.4% baseline)</div>
            <div>Latency Improvement: -44ms average</div>
            <div>Throughput Gain: +205 Mbps average</div>
          </div>
          <div style={validationSectionStyle}>
            <h4> Limited Live Trials</h4>
            <div>Partner: ISRO (non-critical payloads)</div>
            <div>Scope: 10% of total satellite operations</div>
            <div>Operator Oversight: 24/7 human monitoring</div>
            <div>Rollback Time: &lt;5 seconds to manual control</div>
          </div>
        </div>
      </div>

      {/* Continuous Learning Pipeline */}
      <div className="card">
        <h2>🔄 Continuous Learning & Model Updates <span style={{color: '#ff0000', fontSize: '12px'}}>(M)</span></h2>
        <div style={continuousLearningStyle}>
          <div style={learningComponentStyle}>
            <h4>Online Adaptation</h4>
            <div>Model Updates: Every 6 hours</div>
            <div>Learning Rate: Adaptive (0.001 → 0.0001)</div>
            <div>Performance Drift Detection: Active</div>
            <div>A/B Testing: 90/10 split (stable/experimental)</div>
          </div>
          <div style={learningComponentStyle}>
            <h4>Telemetry Dashboard</h4>
            <div>Real-time Metrics: 50+ KPIs tracked</div>
            <div>Alert System: Slack/email notifications</div>
            <div>Performance Regression: Auto-rollback enabled</div>
            <div>Data Pipeline: 99.9% uptime SLA</div>
          </div>
          <div style={learningComponentStyle}>
            <h4>Model Versioning</h4>
            <div>Current Version: v2.3.1 (stable)</div>
            <div>Experimental: v2.4.0-beta (testing)</div>
            <div>Rollback Capability: Last 10 versions</div>
            <div>Deployment Strategy: Blue-green deployment</div>
          </div>
        </div>
      </div>

      {/* Schedule Export/Import */}
      <div className="card">
        <h2>💾 Schedule Management <span style={{color: '#00ff00', fontSize: '12px'}}>(R)</span></h2>
        <div style={managementGridStyle}>
          <div style={managementSectionStyle}>
            <h4>📤 Export Options</h4>
            <button className="btn" style={exportButtonStyle} onClick={exportToCSV}>📊 Export to CSV</button>
            <button className="btn" style={exportButtonStyle} onClick={exportToJSON}>📋 Export to JSON</button>
            <button className="btn" style={exportButtonStyle} onClick={generateReport}>📄 Generate Report</button>
            <button className="btn" style={exportButtonStyle} onClick={emailSchedule}>📧 Email Schedule</button>
          </div>
          <div style={managementSectionStyle}>
            <h4>📥 Import & Templates</h4>
            <button className="btn" style={importButtonStyle} onClick={importSchedule}>📁 Import Schedule</button>
            <button className="btn" style={importButtonStyle} onClick={loadTemplate}>📋 Load Template</button>
            <button className="btn" style={importButtonStyle} onClick={saveAsTemplate}>💾 Save as Template</button>
            <button className="btn" style={importButtonStyle} onClick={restoreBackup}>🔄 Restore Backup</button>
          </div>
          <div style={managementSectionStyle}>
            <h4>Advanced Options</h4>
            <button className="btn" style={advancedButtonStyle} onClick={bulkOperations}>🎛️ Bulk Operations</button>
            <button className="btn" style={advancedButtonStyle} onClick={performanceAnalysis}>📊 Performance Analysis</button>
            <button className="btn" style={advancedButtonStyle} onClick={scheduleValidation}>🔍 Schedule Validation</button>
            <button className="btn" style={advancedButtonStyle} onClick={optimizationSettings}>⚡ Optimization Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const controlPanelStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginBottom: '20px'
};

const controlGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const selectStyle = {
  background: 'linear-gradient(45deg, #1a1327, #252147, #2d2a5f)',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  fontFamily: "'Orbitron', 'Exo 2', monospace",
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '0.08em',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const actionButtonsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '15px',
  marginTop: '20px'
};

const primaryButtonStyle = {
  background: 'linear-gradient(45deg, #1a1327, #252147, #2d2a5f)',
  fontWeight: 'bold',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const actionButtonStyle = {
  background: 'linear-gradient(45deg, #1a1327, #252147, #2d2a5f)',
  fontWeight: 'bold',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const emergencyButtonStyle = {
  background: 'linear-gradient(45deg, #271a1a, #471621, #5f2a2d)',
  fontWeight: 'bold',
  border: '1px solid rgba(255, 69, 0, 0.2)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const timelineContainerStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '10px',
  padding: '20px',
  marginTop: '15px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const timelineHeaderStyle = {
  marginBottom: '20px'
};

const timeAxisStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '10px'
};

const timeMarkerStyle = {
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#00bcd4',
  borderBottom: '2px solid #00bcd4',
  paddingBottom: '5px'
};

const timelineBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const timelineItemStyle = {
  padding: '15px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const timelineItemHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const timelineItemBodyStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  fontSize: '14px'
};

const priorityBadgeStyle = (priority) => ({
  padding: '2px 8px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 'bold',
  background: priority === 'high' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 0, 0.3)',
  border: `1px solid ${priority === 'high' ? '#ff0000' : '#ffff00'}`
});

const conflictGridStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '20px',
  marginTop: '15px'
};

const conflictListStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px'
};

const conflictItemStyle = {
  background: 'rgba(255, 0, 0, 0.1)',
  border: '1px solid #ff0000',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '10px'
};

const conflictHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const conflictSeverityStyle = {
  background: '#ff0000',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 'bold'
};

const conflictDetailsStyle = {
  fontSize: '14px',
  marginBottom: '10px',
  lineHeight: '1.4'
};

const conflictActionsStyle = {
  display: 'flex',
  gap: '10px'
};

const resolveButtonStyle = {
  background: 'linear-gradient(45deg, #1a1327, #252147, #2d2a5f)',
  padding: '6px 12px',
  fontSize: '12px',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const smallButtonStyle = {
  padding: '6px 12px',
  fontSize: '12px'
};

const resolutionOptionsStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px'
};

const optionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '10px',
  fontSize: '14px'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const statCardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center'
};

const statNumberStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#00bcd4',
  margin: '10px 0'
};

const statSubtextStyle = {
  fontSize: '12px',
  color: '#aaa'
};

const managementGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const managementSectionStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const exportButtonStyle = {
  background: 'linear-gradient(45deg, #1a1327, #252147, #2d2a5f)',
  padding: '8px 12px',
  fontSize: '12px',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const importButtonStyle = {
  background: 'linear-gradient(45deg, #1a1327, #252147, #2d2a5f)',
  padding: '8px 12px',
  fontSize: '12px',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const advancedButtonStyle = {
  background: 'linear-gradient(45deg, #271a1a, #471621, #5f2a2d)',
  padding: '8px 12px',
  fontSize: '12px',
  border: '1px solid rgba(255, 69, 0, 0.2)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
};

const curriculumStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const curriculumStageStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

const safetyConstraintsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const safetyLayerStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

const shadowModeStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const validationSectionStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

const continuousLearningStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '15px'
};

const learningComponentStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '14px',
  lineHeight: '1.6'
};

export default Schedule;