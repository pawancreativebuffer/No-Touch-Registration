"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import choice from '../ui/Choice.module.css';
import styles from './GoLiveStep.module.css';
import OutputShowcase from '../ui/OutputShowcase';
import StepFooter from '../ui/StepFooter';
import { Solution } from '../flow';
import { eslLabelCount, screenCount } from '../pricing';
import { SAMPLE_PRODUCTS } from '../products';
import { BackgroundSetup, BrandSetup, DataSetup, EslSetup, FontSetup, GoLiveSetup, ScreenSetup } from '../state';

interface GoLiveStepProps {
  value: GoLiveSetup;
  onChange: (value: GoLiveSetup) => void;
  data: DataSetup;
  solutions: Solution[];
  brand: BrandSetup;
  font: FontSetup;
  everyday: BackgroundSetup;
  promo: BackgroundSetup;
  esl: EslSetup;
  screens: ScreenSetup;
  onAddProducts: () => void;
  onBack: () => void;
  onFinish: () => void;
}

const WORK_MS = 2000;

interface Task {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  busyText?: string;
  action?: { label: string; run: () => void };
}

const GoLiveStep: React.FC<GoLiveStepProps> = ({ value, onChange, data, solutions, brand, font, everyday, promo, esl, screens, onAddProducts, onBack, onFinish }) => {
  const [busy, setBusy] = useState<string | null>(null);
  const hasDevices = solutions.includes('esl') || solutions.includes('screens');

  const run = (id: string, patch: Partial<GoLiveSetup>) => {
    setBusy(id);
    setTimeout(() => {
      setBusy(null);
      onChange({ ...value, ...patch });
    }, WORK_MS);
  };

  const deviceText = [
    solutions.includes('esl') && `${eslLabelCount(esl).toLocaleString()} ESLs`,
    solutions.includes('screens') && `${screenCount(screens)} screens`,
  ]
    .filter(Boolean)
    .join(' and ');

  const publishText = [
    solutions.includes('paper') && 'first tickets ready to print',
    solutions.includes('esl') && 'ESL prices updated',
    solutions.includes('screens') && 'screen content live',
  ]
    .filter(Boolean)
    .join(', ');

  const tasks: Task[] = [
    {
      id: 'products',
      title: 'Products and prices added',
      detail: data.imported ? `${SAMPLE_PRODUCTS.length} products from ${data.source}` : data.helpRequested ? 'Our team will help you connect' : 'Not added yet',
      done: data.imported,
      action: data.imported ? undefined : { label: 'Add products', run: onAddProducts },
    },
    { id: 'designs', title: 'Designs ready', detail: 'Everyday and Promotional designs built from your brand', done: true },
    ...(hasDevices
      ? [
          {
            id: 'devices',
            title: 'Devices connected',
            detail: value.devicesConnected ? `${deviceText} online` : `${deviceText} ready to pair`,
            done: value.devicesConnected,
            busyText: `Pairing ${deviceText}...`,
            action: { label: 'Connect devices', run: () => run('devices', { devicesConnected: true }) },
          },
        ]
      : []),
    {
      id: 'publish',
      title: solutions.includes('screens') ? 'First tickets and screen content published' : 'First tickets published',
      detail: value.published ? publishText.charAt(0).toUpperCase() + publishText.slice(1) : 'Send your designs live',
      done: value.published,
      busyText: 'Publishing...',
      action: { label: 'Publish', run: () => run('publish', { published: true }) },
    },
  ];

  const allDone = tasks.every((t) => t.done);

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>{allDone ? 'You are live with Ticket-IT' : 'Activate your Ticket-IT setup'}</h2>
        <p className={card.subline}>Finish these steps and your branded prices go live everywhere at once.</p>
      </div>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Activation checklist</h3>
        <ul className={styles.tasks}>
          {tasks.map((t, i) => {
            const isBusy = busy === t.id;
            const blocked = t.id === 'publish' && !data.imported;
            return (
              <li key={t.id} className={`${styles.task} ${t.done ? styles.done : ''}`}>
                <span className={styles.check}>
                  {t.done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className={styles.taskText}>
                  <strong>{t.title}</strong>
                  <small>{isBusy ? t.busyText : t.detail}</small>
                </span>
                {isBusy ? (
                  <span className={choice.spinner} />
                ) : (
                  !t.done &&
                  t.action && (
                    <button
                      type="button"
                      className={`${form.button} ${choice.inlineButton} ${styles.taskButton}`}
                      onClick={t.action.run}
                      disabled={!!busy || blocked}
                      title={blocked ? 'Add your products first' : undefined}
                    >
                      <span className={form.buttonText}>{t.action.label}</span>
                    </button>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className={card.section}>
        <div className={styles.message}>
          <h3>Connect your retail data once. Create your branded content. Keep every output consistent.</h3>
          <p>
            One product, one price, one brand, on{' '}
            {solutions.length > 1 ? 'Paper, ESL and Digital Screens' : solutions.includes('paper') ? 'every Paper ticket' : solutions.includes('esl') ? 'every ESL' : 'every Digital Screen'}{' '}
            through Ticket-IT.
          </p>
        </div>
        <OutputShowcase solutions={solutions} brand={brand} font={font} everyday={everyday} promo={promo} esl={esl} screens={screens} products={SAMPLE_PRODUCTS} height={320} />
      </section>

      <StepFooter onBack={onBack} nextLabel="Finish & Login" onNext={onFinish} />
    </div>
  );
};

export default GoLiveStep;
