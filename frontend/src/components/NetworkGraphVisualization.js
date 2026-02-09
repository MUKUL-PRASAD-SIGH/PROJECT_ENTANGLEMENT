import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as turf from '@turf/turf';
import axios from 'axios';

const NetworkGraphVisualization = () => {
  const svgRef = useRef(null);
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (networkData.nodes.length > 0) {
      renderNetworkGraph();
    }
  }, [networkData]);

  const fetchNetworkData = async () => {
    try {
      const [satellitesRes, windowsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/satellites').catch(() => ({ data: { satellites: mockSatellites } })),
        axios.get('http://localhost:5000/api/communication-windows').catch(() => ({ data: { windows: mockWindows } }))
      ]);
      
      const mockSatellites = [
        { name: ' ISS (Mock)', latitude: 19.41, longitude: -92.00, altitude: 419.05 },
        { name: ' HUBBLE (Mock)', latitude: 28.5, longitude: -80.6, altitude: 547.0 }
      ];
      
      const mockWindows = [
        { satellite: ' ISS (Mock)', ground_station: { name: 'ISRO_Bangalore' }, max_elevation: 72.8, duration_minutes: 6.0, is_active: true }
      ];

      const satellites = satellitesRes.data.satellites;
      const windows = windowsRes.data.windows;

      // Create nodes (satellites + ground stations)
      const nodes = [
        ...satellites.map(sat => ({
          id: sat.name,
          type: 'satellite',
          x: sat.longitude,
          y: sat.latitude,
          altitude: sat.altitude,
          data: sat
        })),
        { id: 'ISRO_Bangalore', type: 'ground', x: 77.5946, y: 12.9716, data: { name: 'ISRO Bangalore' } },
        { id: 'ISRO_Sriharikota', type: 'ground', x: 80.2305, y: 13.7199, data: { name: 'ISRO Sriharikota' } },
        { id: 'NASA_Houston', type: 'ground', x: -95.0890, y: 29.5586, data: { name: 'NASA Houston' } }
      ];

      // Create links from communication windows
      const links = windows.map(window => ({
        source: window.satellite,
        target: window.ground_station.name.replace(' ', '_'),
        quality: window.max_elevation,
        duration: window.duration_minutes,
        active: window.is_active
      }));

      // Calculate network metrics using Turf.js
      const activeLinks = links.filter(link => link.active);
      const networkMetrics = {
        totalNodes: nodes.length,
        activeLinks: activeLinks.length,
        networkDensity: (activeLinks.length / (nodes.length * (nodes.length - 1))) * 100,
        avgLinkQuality: activeLinks.reduce((sum, link) => sum + link.quality, 0) / activeLinks.length || 0
      };

      setNetworkData({ nodes, links });
      setMetrics(networkMetrics);
    } catch (error) {
      console.error('Failed to fetch network data:', error);
    }
  };

  const renderNetworkGraph = () => {
    if (!svgRef.current || !networkData || networkData.nodes.length === 0) return;
    
    try {
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create projection for geographic coordinates
    const projection = d3.geoNaturalEarth1()
      .scale(120)
      .translate([width / 2, height / 2]);

    // Create force simulation
    const simulation = d3.forceSimulation(networkData.nodes)
      .force('link', d3.forceLink(networkData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    // Create links
    const links = svg.selectAll('.link')
      .data(networkData.links)
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', d => d.active ? '#00ff00' : '#666')
      .style('stroke-width', d => d.active ? 3 : 1)
      .style('stroke-opacity', d => d.active ? 0.8 : 0.3)
      .style('stroke-dasharray', d => d.active ? 'none' : '5,5');

    // Create nodes
    const nodes = svg.selectAll('.node')
      .data(networkData.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add node circles
    nodes.append('circle')
      .attr('r', d => d.type === 'satellite' ? 8 : 12)
      .style('fill', d => {
        if (d.type === 'satellite') return '#ff6b6b';
        return '#00bcd4';
      })
      .style('stroke', '#fff')
      .style('stroke-width', 2);

    // Add node labels
    nodes.append('text')
      .text(d => d.id.replace('_', ' '))
      .style('font-size', '10px')
      .style('fill', '#fff')
      .style('text-anchor', 'middle')
      .attr('dy', -15);

    // Add tooltips
    nodes.append('title')
      .text(d => {
        if (d.type === 'satellite') {
          return `${d.id}\nAltitude: ${d.altitude?.toFixed(2)} km\nLat: ${d.y?.toFixed(2)}°\nLon: ${d.x?.toFixed(2)}°`;
        }
        return `${d.data.name}\nGround Station`;
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    } catch (error) {
      console.error('Network graph rendering error:', error);
    }
  };

  return (
    <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
      <h3 style={{ color: '#fff', marginBottom: '15px' }}>🕸️ Network Graph Visualization</h3>
      
      {/* Network metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
          <div style={{ color: '#00bcd4', fontSize: '24px', fontWeight: 'bold' }}>{metrics.totalNodes}</div>
          <div style={{ color: '#ccc', fontSize: '12px' }}>Total Nodes</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
          <div style={{ color: '#4caf50', fontSize: '24px', fontWeight: 'bold' }}>{metrics.activeLinks}</div>
          <div style={{ color: '#ccc', fontSize: '12px' }}>Active Links</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
          <div style={{ color: '#ff9800', fontSize: '24px', fontWeight: 'bold' }}>{metrics.networkDensity?.toFixed(1)}%</div>
          <div style={{ color: '#ccc', fontSize: '12px' }}>Network Density</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
          <div style={{ color: '#e91e63', fontSize: '24px', fontWeight: 'bold' }}>{metrics.avgLinkQuality?.toFixed(1)}°</div>
          <div style={{ color: '#ccc', fontSize: '12px' }}>Avg Link Quality</div>
        </div>
      </div>

      {/* Network graph */}
      <svg 
        ref={svgRef} 
        width="800" 
        height="400" 
        style={{ 
          background: '#0a0a0a', 
          borderRadius: '5px',
          border: '1px solid #333'
        }}
      />

      {/* Legend */}
      <div style={{ 
        marginTop: '15px', 
        display: 'flex', 
        justifyContent: 'space-around',
        fontSize: '12px',
        color: '#ccc'
      }}>
        <div>🔴 Satellites</div>
        <div>🔵 Ground Stations</div>
        <div>🟢 Active Links</div>
        <div>⚪ Inactive Links</div>
        <div><strong>Libraries:</strong> D3.js + Turf.js</div>
      </div>
    </div>
  );
};

export default NetworkGraphVisualization;