import React from 'react';
import form from '../../ui/Form.module.css';
import card from '../StepCard.module.css';

interface StepFooterProps {
  backLabel?: string;
  onBack: () => void;
  nextLabel: string;
  /** Omit to make Next a submit button for the surrounding form */
  onNext?: () => void;
  /** Shown right above the buttons, so the user sees why Next didn't move on */
  error?: string;
}

/** Dotted divider with the dark Back/Cancel and pink Next buttons used on every step */
const StepFooter: React.FC<StepFooterProps> = ({ backLabel = 'Back', onBack, nextLabel, onNext, error }) => (
  <>
    {error && (
      <p className={`${form.error} ${card.footerError}`} role="alert">
        {error}
      </p>
    )}
    <div className={card.footer}>
      <button type="button" className={`${form.button} ${form.buttonSecondary} ${card.footerButton}`} onClick={onBack}>
        <span className={form.buttonIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </span>
        <span className={form.buttonText}>{backLabel}</span>
      </button>
      <button type={onNext ? 'button' : 'submit'} className={`${form.button} ${card.footerButton}`} onClick={onNext}>
        <span className={form.buttonIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
        <span className={form.buttonText}>{nextLabel}</span>
      </button>
    </div>
  </>
);

export default StepFooter;
