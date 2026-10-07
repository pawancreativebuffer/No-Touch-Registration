"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ScaledProps {
  /** Design size in pixels; children are laid out at this size */
  width: number;
  height: number;
  /** Largest rendered height in CSS pixels */
  maxHeight: number;
  /** Largest rendered width; defaults to the available width */
  maxWidth?: number;
  /** Width used before the container has been measured */
  fallbackWidth?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Lays children out at their real pixel size (e.g. a 1920 x 158 screen) and scales them
 * to fit the space available, so previews keep the device's exact shape.
 */
const Scaled: React.FC<ScaledProps> = ({ width, height, maxHeight, maxWidth, fallbackWidth = 300, className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(fallbackWidth);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min((maxWidth ? Math.min(maxWidth, available) : available) / width, maxHeight / height);

  return (
    <div ref={ref} className={className} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: width * scale, height: height * scale, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
    </div>
  );
};

export default Scaled;
