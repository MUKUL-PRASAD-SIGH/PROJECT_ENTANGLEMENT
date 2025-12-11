# Utility Scripts

This directory contains helper scripts for setup, training, and maintenance of Project Astraeus.

## Files

*   **`colab_training_setup.py`**: A script designed to run in Google Colab. It sets up the environment and executes the training pipeline for the AI model (RL/PPO).
*   **`install_ai_dependencies.py`**: Automates the installation of complex Python dependencies required for the AI and Digital Twin components.
*   **`test_ai_integration.py`**: A dedicated script to verify that the AI model loads correctly and interfaces with the backend system.

## Usage

**Installing AI Dependencies:**
```bash
python scripts/install_ai_dependencies.py
```

**Testing AI Integration:**
```bash
python scripts/test_ai_integration.py
```
