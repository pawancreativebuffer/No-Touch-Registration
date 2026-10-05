"use client";

import React, { useRef, useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import styles from './PrintSizesStep.module.css';
import CheckCircle from '../ui/CheckCircle';
import SheetPreview from '../ui/SheetPreview';
import StepFooter from '../ui/StepFooter';
import { PRINT_METHODS, PrintMethod, SIZE_GROUPS } from '../data';
import { PrintSetup } from '../state';

interface PrintSizesStepProps {
  kind: 'Standard' | 'Promotional';
  value: PrintSetup;
  onChange: (value: PrintSetup) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const MethodArt: React.FC<{ method: PrintMethod }> = ({ method }) => (
  <div className={`${styles.art} ${styles[method]}`} aria-hidden="true">
    <div className={styles.artSheet}>
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
    <div className={styles.artPrint}>
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i}>
          <i />
          <b>${(i * 7 + 19) % 90}.99</b>
        </span>
      ))}
    </div>
    <div className={styles.printer}>
      <span>PDF</span>
    </div>
  </div>
);

const PrintSizesStep: React.FC<PrintSizesStepProps> = ({ kind, value, onChange, onBack, onNext, nextLabel }) => {
  const [showErrors, setShowErrors] = useState(false);
  const methodRef = useRef<HTMLElement>(null);
  const sizesRef = useRef<HTMLElement>(null);

  const toggleSize = (id: string) =>
    onChange({
      ...value,
      sizes: value.sizes.includes(id) ? value.sizes.filter((s) => s !== id) : [...value.sizes, id],
    });

  const methodError = !value.method ? 'Choose how you would like to print.' : '';
  const sizeError = value.sizes.length === 0 ? 'Select at least one ticket size.' : '';

  const handleNext = () => {
    if (methodError || sizeError) {
      setShowErrors(true);
      (methodError ? methodRef : sizesRef).current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    onNext();
  };

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>How would you like to print your {kind} tickets?</h2>
        <p className={card.subline}>Pick a print process, then tick every {kind.toLowerCase()} ticket size you use</p>
      </div>

      <section className={card.section} ref={methodRef}>
        <h3 className={card.sectionTitle}>Print process</h3>
        <div className={styles.methods}>
          {PRINT_METHODS.map((m) => (
            <div
              key={m.id}
              className={`${styles.option} ${styles.method} ${value.method === m.id ? styles.selected : ''}`}
              onClick={() => onChange({ ...value, method: m.id })}
            >
              <MethodArt method={m.id} />
              <div className={styles.methodText}>
                <CheckCircle checked={value.method === m.id} label={m.text} />
                <span>{m.text}</span>
              </div>
            </div>
          ))}
        </div>
        {showErrors && methodError && <p className={form.error}>{methodError}</p>}
        {showErrors && !methodError && sizeError && <p className={form.error}>{sizeError}</p>}
      </section>

      {SIZE_GROUPS.map((group, gi) => (
        <section key={group.id} className={card.section} ref={gi === 0 ? sizesRef : undefined}>
          <h3 className={card.sectionTitle}>
            Select your {kind} {group.title}
          </h3>
          <div className={styles.sizes}>
            {group.sizes.map((size) => {
              const checked = value.sizes.includes(size.id);
              return (
                <div
                  key={size.id}
                  className={`${styles.option} ${styles.size} ${checked ? styles.selected : ''}`}
                  onClick={() => toggleSize(size.id)}
                >
                  <div className={styles.sheetWrap}>
                    <SheetPreview size={size} height={150} />
                  </div>
                  <div className={styles.sizeLabel}>
                    <CheckCircle checked={checked} label={`${size.name} ${size.up} ${size.dims}`} />
                    <span>
                      <strong>{[size.name, size.up].filter(Boolean).join(' ')}</strong>
                      <small>{size.dims} mm</small>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className={card.section}>
        <div className={styles.custom}>
          <strong>Require a custom size?</strong>
          <span>Call us and we will set it up for you.</span>
        </div>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors ? [methodError, sizeError].filter(Boolean).join(' ') : ''}
      />
    </div>
  );
};

export default PrintSizesStep;
