"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import choice from '../ui/Choice.module.css';
import styles from './SolutionStep.module.css';
import CheckCircle from '../ui/CheckCircle';
import Illustration from '../ui/Illustrations';
import StepFooter from '../ui/StepFooter';
import { Solution, SOLUTION_NAMES, SOLUTION_ORDER } from '../flow';

interface SolutionStepProps {
  value: Solution[];
  onChange: (value: Solution[]) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const COPY: Record<Solution, { text: string; points: string[] }> = {
  paper: {
    text: 'Branded shelf tickets printed in store on your own printer.',
    points: ['Everyday Tickets and Promotional Tickets', 'Pre-printed or full colour stock', 'Lease a printer and order paper'],
  },
  esl: {
    text: 'Electronic Shelf Labels that update prices on the shelf automatically.',
    points: ['Five Zkong sizes, 2.3" to 10.2"', 'Black, white, red and yellow', 'Rails, clips, stands and access points'],
  },
  screens: {
    text: 'Digital Screens that bring offers to life with moving, branded content.',
    points: ['Shelf-edge bars, wide and floor-standing', 'Static and animated content', 'Single and Multi Product layouts'],
  },
};

const SolutionStep: React.FC<SolutionStepProps> = ({ value, onChange, onBack, onNext, nextLabel }) => {
  const [showErrors, setShowErrors] = useState(false);

  const toggle = (s: Solution) => onChange(value.includes(s) ? value.filter((x) => x !== s) : [...value, s]);

  const handleNext = () => {
    if (value.length === 0) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>What would you like to set up?</h2>
        <p className={card.subline}>Choose one, two or all three. We will tailor the next steps to your choice.</p>
      </div>

      <section className={card.section}>
        <div className={choice.grid3}>
          {SOLUTION_ORDER.map((s) => {
            const checked = value.includes(s);
            return (
              <div
                key={s}
                className={`${choice.option} ${styles.solution} ${checked ? choice.selected : ''}`}
                onClick={() => toggle(s)}
              >
                <div className={styles.art}>
                  <Illustration id={s} className={styles.svg} />
                </div>
                <div className={choice.cardHead}>
                  <CheckCircle checked={checked} label={SOLUTION_NAMES[s]} />
                  <span className={choice.cardTitle}>
                    <strong>{SOLUTION_NAMES[s]}</strong>
                  </span>
                </div>
                <p className={styles.text}>{COPY[s].text}</p>
                <ul className={styles.points}>
                  {COPY[s].points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {value.length > 1 && (
        <section className={card.section}>
          <div className={choice.note}>
            <strong>One brand, every output.</strong>
            <span>You will add your logo and colours once, and we will use them across {value.map((s) => SOLUTION_NAMES[s]).join(', ')}.</span>
          </div>
        </section>
      )}

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors && value.length === 0 ? 'Choose at least one solution to continue.' : ''}
      />
    </div>
  );
};

export default SolutionStep;
