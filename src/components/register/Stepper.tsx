import React from 'react';
import styles from './Stepper.module.css';

interface StepperProps {
  steps: string[];
  current: number;
  onStepClick?: (index: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, current, onStepClick }) => {
  const progress = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;

  return (
    <div className={styles.stepper} style={{ '--count': steps.length } as React.CSSProperties}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
      <ol className={styles.steps}>
        {steps.map((label, index) => {
          const state = index < current ? styles.done : index === current ? styles.current : '';
          const clickable = index < current && onStepClick;
          return (
            <li key={label} className={`${styles.step} ${state}`}>
              <button
                type="button"
                className={styles.dot}
                disabled={!clickable}
                onClick={() => clickable && onStepClick(index)}
                aria-label={label}
                aria-current={index === current ? 'step' : undefined}
              >
                {index < current && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
              <span className={styles.label}>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Stepper;
