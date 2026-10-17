import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Target coordinates from mousemove
  const mousePos = useRef({ x: -200, y: -200 });
  // Interpolated smooth position for soft follower glow
  const followerPos = useRef({ x: -200, y: -200 });

  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check if touch device or screen width < 992 or prefers-reduced-motion
    const checkCapability = () => {
      const isTouch = window.innerWidth < 992 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(isTouch || prefersReduced);
    };

    checkCapability();
    window.addEventListener('resize', checkCapability);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Instantly position the primary dot for zero-latency accuracy
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${isHovered ? 1.6 : 1})`;
      }

      // Check if hovering clickable or interactive surface
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.interactive-card') ||
          target.closest('.chip-bubble') ||
          target.closest('.ojas-floating-trigger'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    // Smooth RAF loop for follower glow (lerp calculation)
    const animate = () => {
      // Lerp factor (0.16 = smooth natural trailing)
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.16;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.16;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', checkCapability);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isHovered]);

  if (isMobile) return null;

  return (
    <>
      {/* Soft radial cursor follower glow */}
      <div
        ref={glowRef}
        className={`custom-cursor-glow ${isHovered ? 'hovered' : ''}`}
        aria-hidden="true"
      />
      {/* High-precision micro dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHovered ? 'active' : ''} ${isPressed ? 'pressed' : ''}`}
        aria-hidden="true"
      />
    </>
  );
};
