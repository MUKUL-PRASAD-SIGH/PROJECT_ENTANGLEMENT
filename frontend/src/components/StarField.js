import React, { useEffect, useRef, useState } from 'react';

const StarField = () => {
  const canvasRef = useRef(null);
  const [selectedStar, setSelectedStar] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // === Star & celestial data ===
    const starData = [
      { name: 'Sirius', info: 'Brightest star in night sky, 8.6 light-years away' },
      { name: 'Vega', info: 'Former pole star, 25 light-years away' },
      { name: 'Arcturus', info: 'Orange giant, 37 light-years away' },
      { name: 'Rigel', info: 'Blue supergiant in Orion, 860 light-years away' },
      { name: 'Betelgeuse', info: 'Red supergiant, may explode as supernova' },
      { name: 'Aldebaran', info: 'Red giant in Taurus, 65 light-years away' },
      { name: 'Spica', info: 'Binary star system in Virgo' },
      { name: 'Antares', info: 'Red supergiant in Scorpius' },
      { name: 'Pollux', info: 'Orange giant in Gemini' },
      { name: 'Fomalhaut', info: 'Lonely star in Piscis Austrinus' }
    ];

    const celestialObjects = [
      { 
        name: 'Jupiter', type: 'planet', x: 400, y: 300, size: 20, color: '#d2b48c', info: 'Gas giant, largest planet in Solar System' 
      },
      { 
        name: 'Saturn', type: 'planet', x: 700, y: 200, size: 18, color: '#e3c16f', info: 'Gas giant with prominent rings' 
      },
      { 
        name: 'Europa', type: 'moon', x: 420, y: 320, size: 5, color: '#bbb', info: 'Icy moon of Jupiter, may have subsurface ocean' 
      }
    ];

    starData.push(...celestialObjects);

    // === Resize canvas ===
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // === Stars ===
    const stars = [];
    const numStars = 80;
    for (let i = 0; i < numStars; i++) {
      const starInfo = starData[i % starData.length];
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: ['#ffffff', '#ffd700', '#48dbfb', '#ff6b6b'][Math.floor(Math.random() * 4)],
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        name: starInfo.name + (i >= starData.length ? ` ${Math.floor(i/starData.length) + 1}` : ''),
        info: starInfo.info
      });
    }

    // === Shooting stars / meteors ===
    const shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.9,
        y: Math.random() * canvas.height * 0.5,
        length: 150 + Math.random() * 150,
        speed: 8 + Math.random() * 4,
        opacity: 1,
        angle: Math.PI / 3 + (Math.random() * 0.2 - 0.1)
      });
    };
    setInterval(() => {
      const count = 1 + Math.floor(Math.random() * 2); // 1–2 at a time
      for (let i = 0; i < count; i++) spawnShootingStar();
    }, 4000); // every 4 seconds

    // === Comet ===
    const comet = {
      x: canvas.width * 0.9,
      y: canvas.height * 0.1,
      radius: 10,
      vx: -2,
      vy: 1.2,
      tailLength: 200,
      particles: []
    };

    // === Mouse click ===
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedStar = stars.find(star => {
        const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
        return distance <= star.size + 10;
      });

      if (clickedStar) {
        if (e.ctrlKey) {
          setSelectedStar(clickedStar);
          setShowInfo(true);
        } else if (e.detail === 2) {
          setSelectedStar(clickedStar);
          setShowInfo(false);
        }
      } else {
        setSelectedStar(null);
        setShowInfo(false);
      }
    };
    canvas.addEventListener('click', handleClick);

    // === Animation loop ===
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        star.brightness += star.twinkleSpeed;
        if (star.brightness > 1 || star.brightness < 0.3) star.twinkleSpeed = -star.twinkleSpeed;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.brightness;
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - s.length * Math.cos(s.angle),
          s.y - s.length * Math.sin(s.angle)
        );
        ctx.stroke();
        ctx.restore();

        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);
        s.opacity -= 0.01;
        if (s.opacity <= 0) shootingStars.splice(i, 1);
      }

      // Draw planets & moons
      celestialObjects.forEach(obj => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
        ctx.fillStyle = obj.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = obj.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (obj.name === 'Saturn') {
          ctx.save();
          ctx.translate(obj.x, obj.y);
          ctx.rotate(-0.4);

          const rings = [
            { rx: obj.size * 2.0, ry: obj.size * 1.0, alpha: 0.5 },
            { rx: obj.size * 2.4, ry: obj.size * 1.0, alpha: 0.6 },
            { rx: obj.size * 2.6, ry: obj.size * 1.0, alpha: 0.6 },
            { rx: obj.size * 2.2, ry: obj.size * 0.8, alpha: 0.7 },
            { rx: obj.size * 2.8, ry: obj.size * 1.0, alpha: 0.6 },
            { rx: obj.size * 3.2, ry: obj.size * 1.0, alpha: 0.6 },
            { rx: obj.size * 3.4, ry: obj.size * 1.2, alpha: 0.4 }
          ];

          rings.forEach(r => {
            ctx.beginPath();
            ctx.ellipse(0, 0, r.rx, r.ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(220,220,180,${r.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          });

          ctx.restore();
        }
      });

     // Update comet position
comet.x += comet.vx;
comet.y += comet.vy;

// Loop the comet
if (comet.x > canvas.width + 50) comet.x = -50;
if (comet.x < -50) comet.x = canvas.width + 50;
if (comet.y > canvas.height + 50) comet.y = -50;
if (comet.y < -50) comet.y = canvas.height + 50;

// Solid glowing tail
const tailGradient = ctx.createLinearGradient(
  comet.x, comet.y,
  comet.x - comet.vx * comet.tailLength,
  comet.y - comet.vy * comet.tailLength
);
tailGradient.addColorStop(0, 'rgba(85, 221, 255, 0.8)');
tailGradient.addColorStop(1, 'rgba(85, 221, 255, 0)');
ctx.beginPath();
ctx.moveTo(comet.x, comet.y);
ctx.lineTo(comet.x - comet.vx * comet.tailLength, comet.y - comet.vy * comet.tailLength);
ctx.strokeStyle = tailGradient;
ctx.lineWidth = 10;
ctx.stroke();

// Dust particle trail
comet.particles.push({
  x: comet.x,
  y: comet.y,
  radius: Math.random() * 2 + 1,
  alpha: 1,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5
});

for (let i = comet.particles.length - 1; i >= 0; i--) {
  const p = comet.particles[i];
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(85, 221, 255, ${p.alpha})`;
  ctx.fill();

  // Update particle
  p.x += p.vx;
  p.y += p.vy;
  p.alpha -= 0.02;

  if (p.alpha <= 0) comet.particles.splice(i, 1);
}

// Draw comet head
ctx.beginPath();
ctx.arc(comet.x, comet.y, comet.radius, 0, Math.PI * 1.8);
ctx.fillStyle = '#00c8ffff';
ctx.shadowBlur = 20;
ctx.shadowColor = '#ffffffff';
ctx.fill();
ctx.shadowBlur = 0;



      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          cursor: 'crosshair'
        }}
      />
      {selectedStar && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '15px',
          borderRadius: '10px',
          border: '1px solid #ffd700',
          zIndex: 1000,
          maxWidth: '300px',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>{selectedStar.name}</h3>
          {showInfo && <p style={{ margin: 0, fontSize: '14px' }}>{selectedStar.info}</p>}
          <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
            Double-click: Name only | Ctrl+Click: Full info
          </div>
        </div>
      )}
    </>
  );
};

export default StarField;
