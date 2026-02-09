import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// ===== FLOATING STARS EFFECT =====
class FloatingStars {
  constructor() {
    this.starsContainer = null;
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Create stars container
    this.starsContainer = document.createElement('div');
    this.starsContainer.className = 'stars-container';
    this.starsContainer.id = 'starsContainer';

    // Insert at the beginning of body
    document.body.insertBefore(this.starsContainer, document.body.firstChild);

    // No initial stars - clean start
    // this.createStars(8); // Removed initial star creation

    // Start periodic shooting stars (extremely infrequent)
    this.startShootingStars();

    // Minimal star maintenance (only for shooting stars cleanup)
    this.startStarMaintenance();
  }

  createStars(count = 8) {
    for (let i = 0; i < count; i++) {
      this.createStar();
    }
  }

  createStar() {
    if (!this.starsContainer) return;

    const star = document.createElement('div');
    star.className = 'star floating';

    // Random size distribution (more small stars, fewer large ones)
    const rand = Math.random();
    let size;
    if (rand < 0.6) size = 'small';
    else if (rand < 0.9) size = 'medium';
    else size = 'large';

    star.classList.add(size);

    // 20% chance for blue tint to match space theme
    if (Math.random() < 0.2) {
      star.classList.add('blue-tint');
    }

    // Random position
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';

    // Random animation delays for natural feel
    const twinkleDelay = Math.random() * 3;
    const floatDelay = Math.random() * 8;
    star.style.animationDelay = `${twinkleDelay}s, ${floatDelay}s`;

    // Random floating duration for variation
    const floatDuration = 6 + Math.random() * 4; // 6-10 seconds
    star.style.setProperty('animation-duration', `3s, ${floatDuration}s`);

    this.starsContainer.appendChild(star);
  }

  createShootingStar() {
    if (!this.starsContainer) return;

    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';

    // 30% chance for blue tint
    if (Math.random() < 0.3) {
      shootingStar.classList.add('blue-tint');
    }

    // Random starting height (upper portion of screen)
    shootingStar.style.top = Math.random() * 40 + '%';
    shootingStar.style.left = '-100px';

    // Extremely slow animation with random duration between 10-20 seconds
    const duration = 10 + Math.random() * 10; // 10-20 seconds for extremely slow, graceful movement
    shootingStar.style.animationDuration = duration + 's';

    // Random delay before appearing (0-5 seconds)
    shootingStar.style.animationDelay = Math.random() * 5 + 's';

    this.starsContainer.appendChild(shootingStar);

   
    setTimeout(() => {
      if (shootingStar.parentNode) {
        shootingStar.parentNode.removeChild(shootingStar);
      }
    }, (duration + 5) * 1000);
  }

  startShootingStars() {
    const firstDelay = 3000 + Math.random() * 3000; // 3-6 seconds
    setTimeout(() => {
      this.createShootingStar();

      // Then create shooting stars at ultra-long, random intervals
      const scheduleNextShootingStar = () => {
        const nextInterval = 6000 + Math.random() * 12000; // 6-18 seconds
        
        setTimeout(() => {
          // Only 5% chance to create shooting star when interval hits (ultra rare)
          if (Math.random() < 0.05) {
            this.createShootingStar();
          }
          // Schedule the next one regardless
          scheduleNextShootingStar();
        }, nextInterval);
      };

      scheduleNextShootingStar();
    }, firstDelay);
  }

  startStarMaintenance() {
    // Minimal cleanup - only remove old shooting stars if needed
    setInterval(() => {
      if (this.starsContainer) {
        const shootingStars = this.starsContainer.querySelectorAll('.shooting-star');
        // Clean up any orphaned shooting stars older than 30 seconds
        shootingStars.forEach(star => {
          if (star.style.animationPlayState === 'paused' || 
              star.style.opacity === '0') {
            star.remove();
          }
        });
      }
    }, 30000); // Cleanup every 30 seconds

    // No regular star creation - only shooting stars now
  }
  }


// Initialize floating stars
const floatingStars = new FloatingStars();

//React initialization
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);