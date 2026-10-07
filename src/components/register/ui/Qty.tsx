import React from 'react';
import styles from './Qty.module.css';

interface QtyProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  label: string;
}

/** Quantity selector: minus, typed value, plus */
const Qty: React.FC<QtyProps> = ({ value, onChange, step = 1, min = 0, max = 9999, label }) => {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, Math.round(v) || 0)));
  return (
    <div className={styles.qty} onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => set(value - step)} aria-label={`Decrease ${label}`} disabled={value <= min}>
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={label}
      />
      <button type="button" onClick={() => set(value + step)} aria-label={`Increase ${label}`} disabled={value >= max}>
        +
      </button>
    </div>
  );
};

export default Qty;
