![CI](https://github.com/MUKUL-PRASAD-SIGH/PROJECT_ENTANGLEMENT/actions/workflows/ci.yml/badge.svg)
# 🚀 PROJECT ASTRAEUS: Mission Control 🌌

> *Solving the traffic jam in the sky, one orbit at a time.*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production%20Ready-green.svg)](docs/status/PROJECT_STATUS.md)
[![SIH 2025](https://img.shields.io/badge/SIH-2025-orange.svg)](https://sih.gov.in)

Welcome to **Project Astraeus**! You are now entering the digital twin of our orbital network. We use **Graph Neural Networks** and **Reinforcement Learning** to teach satellites how to talk to ground stations without crashing the network. It's like air traffic control, but way cooler because it's in space. 🛰️✨

---
<li>
  <b>🚀 Project Astraeus (Mission Control System)</b><br>
  <a href="https://astraeus-frontend.onrender.com/">🔗 Live Demo</a><br>
  <i>AI-powered Mission Control System with digital-twin simulation, real-time monitoring, and intelligent decision support for complex operational environments.</i>
</li>
<li>

<h2>🚀 Project Astraeus</h2>
<h4>🛰️ AI Mission Control • Digital Twin • Real-Time Intelligence</h4>

<p>
<a href="https://astraeus-frontend.onrender.com/">
<b>🌐 LAUNCH LIVE SYSTEM</b>
</a>
</p>

<p>
<i>
Next-generation AI-powered Mission Control System enabling digital-twin simulation, live operational monitoring, predictive analytics, and intelligent decision orchestration.
</i>
</p>

---

<p>
📸 <b>Snapshots:</b><br>
<a href="https://drive.google.com/drive/folders/1AHVk5izQVH7GNwUCNlqMjTkejOCo__C2">
View Screenshots
</a>
</p>

<p>
📑 <b>Presentation (PPT):</b><br>
<a href="https://drive.google.com/file/d/1J7chNunefsQI_66kI-Rw7o2oZzRiuaWf/view">
View Project PPT
</a>
</p>

<p>
🎥 <b>Video Demo:</b><br>
<a href="https://youtu.be/HiNK79Ijav8">
Watch Full Demo
</a>
</p>

</li>



## 📋 Mission Briefing (Table of Contents)

- [🚀 PROJECT ASTRAEUS: Mission Control 🌌](#-project-astraeus-mission-control-)
  - [📋 Mission Briefing (Table of Contents)](#-mission-briefing-table-of-contents)
  - [🌟 What is this?](#-what-is-this)
  - [🛠️ The Tech Stack (Our Spaceship)](#️-the-tech-stack-our-spaceship)
  - [📂 Navigation Map (Repository Index)](#-navigation-map-repository-index)
  - [⚡ Quick Start: Launch Sequence](#-quick-start-launch-sequence)
    - [Prerequisites (Pre-flight Check)](#prerequisites-pre-flight-check)
    - [Step 1: Ignite the Backend Engines 🐍](#step-1-ignite-the-backend-engines-)
    - [Step 2: Launch the Mission Control UI ⚛️](#step-2-launch-the-mission-control-ui-️)
    - [Step 3: Run Diagnostics (Optional) 🧪](#step-3-run-diagnostics-optional-)
  - [🎮 How to Play (Usage)](#-how-to-play-usage)
  - [🧠 The Brains (AI Model)](#-the-brains-ai-model)
  - [📚 Documentation Archives](#-documentation-archives)
  - [👨‍🚀 Crew & Acknowledgments](#-crew--acknowledgments)

---

## 🌟 What is this?

Imagine thousands of satellites trying to send data to Earth at the same time. Chaos? Yes. 
**Astraeus** solves this by creating a **Digital Twin** of the network and training an AI (our "Pilot") to schedule communications perfectly. 

**Key Capabilities:**
*   🌍 **3D Visualization:** Watch satellites zip around Earth in real-time (thanks, CesiumJS!).
*   🤖 **AI Brain:** A PPO Agent trained on 100k episodes to optimize data throughput.
*   📡 **Live Telemetry:** Real-time data streaming via WebSockets.
*   ⚡ **Digital Twin:** Physics-accurate orbital simulation.

---

## 🛠️ The Tech Stack (Our Spaceship)

| Component | Tech | Description |
| :--- | :--- | :--- |
| **Brain** | Python, PyTorch, Stable-Baselines3 | The RL Agent & GNN |
| **Engine** | Skyfield, NumPy | Orbital Mechanics Simulator |
| **Body** | Flask, Socket.IO | Backend API & Real-time Stream |
| **Viewscreen** | React, CesiumJS | 3D Mission Control Dashboard |

---

## 📂 Navigation Map (Repository Index)

Lost in space? Here's your map.

| Module | Description | Link |
| :--- | :--- | :--- |
| **Backend** | The core engine room. | [Go to Engine Room](backend/README.md) |
| **Frontend** | The cockpit/dashboard. | [Go to Cockpit](frontend/README.md) |
| **Docs** | Manuals and blueprints. | [Read Manuals](docs/README.md) |
| **AI Models** | The pilot's training data. | [Inspect Brain](model&datareq/README.md) |
| **Scripts** | Maintenance tools. | [View Tools](scripts/README.md) |

---

## ⚡ Quick Start: Launch Sequence

Follow these instructions exactly, Cadet, and you'll be orbital in T-minus 5 minutes.

### Prerequisites (Pre-flight Check)
*   **Python 3.8+** (The snake)
*   **Node.js 14+** (The engine)
*   **Git** (The log)

### Step 1: Ignite the Backend Engines 🐍
Open your terminal (Command Center) and run:

```bash
# 1. Enter the backend sector
cd backend

# 2. Install fuel (dependencies)
pip install -r requirements.txt

# 3. Ignite main thrusters
python api_server.py
```
✅ **System Check:** You should see `Running on http://localhost:5000`. Keep this terminal OPEN!

### Step 2: Launch the Mission Control UI ⚛️
Open a **new** terminal window (don't close the first one!):

```bash
# 1. Enter the frontend sector
cd frontend

# 2. Install modules (this might take a moment)
npm install

# 3. Launch dashboard
npm start
```
✅ **System Check:** Your browser should open `http://localhost:3000` automatically. Welcome to Mission Control! 🌍

### Step 3: Run Diagnostics (Optional) 🧪
Want to make sure everything is nominal? Run the test suite:
```bash
# From the project root
pytest backend/tests
```

---

## 🎮 How to Play (Usage)

Once you are in the **Mission Control Dashboard**:

1.  **Dashboard:** Check the overall system health and active satellite count.
2.  **Satellites:** Click "Track" on any satellite to see it in the 3D globe.
3.  **Schedule:** Watch the AI generate communication windows in real-time.
4.  **Analytics:** See the AI beat the classical algorithms in the "AI Performance" tab. 📈

---

## 🧠 The Brains (AI Model)

Our AI isn't just a random number generator. It's a **Graph Neural Network** combined with **Proximal Policy Optimization (PPO)**.
*   **Training:** 100,000 Episodes on Google Colab.
*   **Reward:** +847.3 (That's a high score!).
*   **Improvement:** +23.4% efficiency over standard schedulers.

*Want to retrain it? Check out `scripts/colab_training_setup.py`!*

---

## 📚 Documentation Archives

For the deep divers and space engineers:
*   📜 **[Full Development History](docs/planning/DEVELOPMENT_PHASES.md)** (How we built this)
*   🔌 **[API Reference](docs/api/API_DOCUMENTATION.md)** (How to talk to the backend)
*   🏗️ **[System Architecture](docs/architecture/ARCHITECTURE_CHANGES.md)** (How it fits together)

---

**Project Astraeus** — *Ad Astra Per Aspera* (To the stars through difficulties) 🌠
