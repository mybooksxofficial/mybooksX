import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glowColor: string;
  alpha: number;
  life: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: 'star' | 'circle' | 'diamond' | 'spark';
}

// Rich Brand Palette (Royal Blue, Sunlight Gold, Peach, Champagne, Espresso shimmer)
const BRAND_PARTICLES = [
  { color: '#0A58CA', glow: 'rgba(10, 88, 202, 0.6)' },   // Royal Blue
  { color: '#2563EB', glow: 'rgba(37, 99, 235, 0.6)' },   // Electric Royal
  { color: '#FFAA00', glow: 'rgba(255, 170, 0, 0.7)' },   // Warm Gold
  { color: '#FFB703', glow: 'rgba(255, 183, 3, 0.7)' },   // Sunlight Amber
  { color: '#FFDBBB', glow: 'rgba(255, 219, 187, 0.8)' }, // Warm Peach
  { color: '#D97706', glow: 'rgba(217, 119, 6, 0.6)' },   // Bronze Ochre
  { color: '#60A5FA', glow: 'rgba(96, 165, 250, 0.6)' },  // Soft Blue
];

export const CursorSprinkles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Only run on non-touch devices and if user does not prefer reduced motion
    const isTouch = window.innerWidth < 992 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const spawnSprinkle = (x: number, y: number, count = 2, burst = false) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 2.5 + Math.random() * 5.5 : 0.8 + Math.random() * 2.8;
        const shapes: Particle['shape'][] = ['star', 'star', 'diamond', 'circle', 'spark'];
        const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
        const palette = BRAND_PARTICLES[Math.floor(Math.random() * BRAND_PARTICLES.length)];

        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (burst ? 2.2 : 0.8),
          size: burst ? 6 + Math.random() * 8 : 4 + Math.random() * 6,
          color: palette.color,
          glowColor: palette.glow,
          alpha: 1,
          life: 1,
          decay: burst ? 0.015 + Math.random() * 0.018 : 0.018 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.28,
          shape: chosenShape,
        });
      }

      // Allow healthy amount of particles for heavy aesthetic without dropping frames
      if (particlesRef.current.length > 150) {
        particlesRef.current = particlesRef.current.slice(-150);
      }
    };

    let moveCounter = 0;
    const onMouseMove = (e: MouseEvent) => {
      moveCounter++;
      // Continuous sprinkles while moving
      if (moveCounter % 2 === 0) {
        spawnSprinkle(e.clientX, e.clientY, 2, false);
      }

      // Heavy sprinkles cascade when hovering buttons or interactive cards
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.interactive-card') ||
          target.closest('.product-card'))
      ) {
        spawnSprinkle(e.clientX, e.clientY, 3, false);
      }
    };

    // Spectacular burst on click
    const onMouseDown = (e: MouseEvent) => {
      spawnSprinkle(e.clientX, e.clientY, 28, true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });

    // Render loop with high-def soft glows
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // natural gentle gravity
        p.rotation += p.vRot;
        p.life -= p.decay;
        p.alpha = Math.max(0, p.life);

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Vibrant neon/glass glow effect
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          // Sharp 4-point glittering star
          const r = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();

          // Bright white core shine
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'diamond') {
          // Radiant diamond
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'spark') {
          // Cross sparkle
          ctx.beginPath();
          ctx.rect(-p.size * 0.15, -p.size, p.size * 0.3, p.size * 2);
          ctx.rect(-p.size, -p.size * 0.15, p.size * 2, p.size * 0.3);
          ctx.fill();
        } else {
          // Glowing floating orbs
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99990,
      }}
      aria-hidden="true"
    />
  );
};
