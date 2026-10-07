import React from 'react';
import { WizardStep } from './flow';
import styles from './Stepper.module.css';

interface StepperProps {
  steps: WizardStep[];
  current: number;
  /** Furthest step reached; any step up to it can be revisited */
  furthest: number;
  onStepClick?: (index: number) => void;
}

/** Vertical progress list of every step in the current flow */
const Stepper: React.FC<StepperProps> = ({ steps, current, furthest, onStepClick }) => {
  const progress = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;

  return (
    <nav className={styles.stepper} aria-label="Signup progress">
      <div className={styles.summary}>
        <span>
          Step {current + 1} of {steps.length}
        </span>
        <strong>{steps[current]?.label}</strong>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ol className={styles.steps}>
        {steps.map((step, index) => {
          const state = index < current ? styles.done : index === current ? styles.current : index <= furthest ? styles.visited : '';
          const clickable = index !== current && index <= furthest && onStepClick;
          return (
            <li key={step.id} className={`${styles.step} ${state}`}>
              <button
                type="button"
                className={styles.button}
                disabled={!clickable}
                onClick={() => clickable && onStepClick(index)}
                aria-current={index === current ? 'step' : undefined}
              >
                <span className={styles.dot}>
                  {index < current ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className={styles.label}>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;
