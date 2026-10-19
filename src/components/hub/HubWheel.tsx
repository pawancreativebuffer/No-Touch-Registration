"use client";

import React, { useEffect } from 'react';
import styles from './HubWheel.module.css';

export interface WheelOption {
  id: string;
  title: string;
  text: string;
  colour: string;
  icon: React.ReactNode;
}

interface HubWheelProps {
  options: WheelOption[];
  onPick: (id: string) => void;
  onClose: () => void;
}

const SIZE = 600;
const C = SIZE / 2;
const OUTER = 290;
const INNER = 105;
const GAP = 3; // degrees between segments

const LABEL_R = 205;

const point = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};

/** Ring segment between two angles (0deg = top, clockwise) */
const segment = (from: number, to: number) => {
  const [x1, y1] = point(OUTER, from);
  const [x2, y2] = point(OUTER, to);
  const [x3, y3] = point(INNER, to);
  const [x4, y4] = point(INNER, from);
  const large = to - from > 180 ? 1 : 0;
  return `M${x1} ${y1} A${OUTER} ${OUTER} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${INNER} ${INNER} 0 ${large} 0 ${x4} ${y4} Z`;
};

/** The hub options in a ring. Click a segment to open that option. */
const HubWheel: React.FC<HubWheelProps> = ({ options, onPick, onClose }) => {
  const step = 360 / options.length;

  // Escape closes the wheel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} role="dialog" aria-label="Build your setup" onClick={onClose}>
      <div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.wheel}>
          {options.map((o, i) => {
            const from = i * step - step / 2 + GAP / 2;
            const to = from + step - GAP;
            const [lx, ly] = point(LABEL_R, i * step);
            return (
              <g
                key={o.id}
                className={styles.segment}
                role="button"
                tabIndex={0}
                aria-label={o.title}
                onClick={() => onPick(o.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick(o.id)}
                style={{ '--seg': o.colour } as React.CSSProperties}
              >
                <path d={segment(from, to)} />
                <foreignObject x={lx - 76} y={ly - 78} width={152} height={156}>
                  <div className={styles.label}>
                    <span className={styles.icon}>{o.icon}</span>
                    <strong>{o.title}</strong>
                    <small>{o.text}</small>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <div className={styles.centre} />
      </div>
      <p className={styles.hint}>Click an option to open it. Press Alt or Esc to close.</p>
    </div>
  );
};

export default HubWheel;
