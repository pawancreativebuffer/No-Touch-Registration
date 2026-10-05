import React from 'react';
import styles from './CheckCircle.module.css';

interface CheckCircleProps {
  checked: boolean;
  onClick?: () => void;
  label: string;
}

/** Pink selection circle used under every selectable option in the design */
const CheckCircle: React.FC<CheckCircleProps> = ({ checked, onClick, label }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    className={`${styles.circle} ${checked ? styles.checked : ''}`}
    onClick={onClick}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </button>
);

export default CheckCircle;
