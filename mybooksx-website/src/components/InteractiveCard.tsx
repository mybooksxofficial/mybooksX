import React, { useRef, useState, useCallback, useEffect } from 'react';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 7)
  spotlightColor?: string; // Color of radial spotlight
  glowBorder?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  maxTilt = 7,
  spotlightColor = 'rgba(10, 88, 202, 0.12)',
  glowBorder = true,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, opacity: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = window.innerWidth < 992 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchDevice(isTouch || prefersReduced);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate tilt angles normalized (-0.5 to 0.5)
      const xNorm = (x / rect.width) - 0.5;
      const yNorm = (y / rect.height) - 0.5;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setCoords({ x, y, opacity: 1 });
        setTilt({
          rx: -yNorm * maxTilt, // Rotate X depends on vertical distance
          ry: xNorm * maxTilt,  // Rotate Y depends on horizontal distance
        });
      });
    },
    [isTouchDevice, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    setCoords((prev) => ({ ...prev, opacity: 0 }));
    setTilt({ rx: 0, ry: 0 });
  }, [isTouchDevice]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`interactive-3d-card ${className}`}
      style={{
        ...style,
        transform: isTouchDevice
          ? undefined
          : `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
        transition: coords.opacity === 0 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease' : 'box-shadow 0.2s ease',
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      {!isTouchDevice && (
        <div
          className="card-spotlight-layer"
          style={{
            opacity: coords.opacity,
            background: `radial-gradient(circle 280px at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 75%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Dynamic Border Glow following Cursor */}
      {!isTouchDevice && glowBorder && (
        <div
          className="card-border-glow-layer"
          style={{
            opacity: coords.opacity * 0.8,
            background: `radial-gradient(circle 220px at ${coords.x}px ${coords.y}px, rgba(10, 88, 202, 0.4), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Content Wrapper for Z-Depth */}
      <div className="card-inner-content">{children}</div>
    </div>
  );
};
