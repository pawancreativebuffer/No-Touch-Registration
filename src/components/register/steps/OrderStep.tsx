"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import choice from '../ui/Choice.module.css';
import styles from './OrderStep.module.css';
import Illustration from '../ui/Illustrations';
import StepFooter from '../ui/StepFooter';
import { money } from '../data';
import { Solution, SOLUTION_NAMES, SOLUTION_ORDER } from '../flow';
import { eslOrder, OrderGroup, paperOrder, screenOrder } from '../pricing';
import { EslSetup, PurchaseSetup, ScreenSetup } from '../state';

interface OrderStepProps {
  solutions: Solution[];
  purchase: PurchaseSetup;
  esl: EslSetup;
  screens: ScreenSetup;
  placed: boolean;
  onPlaced: () => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const PROCESSING_MS = 1800;

const OrderStep: React.FC<OrderStepProps> = ({ solutions, purchase, esl, screens, placed, onPlaced, onBack, onNext, nextLabel }) => {
  const [processing, setProcessing] = useState(false);

  const groups: OrderGroup[] = SOLUTION_ORDER.filter((s) => solutions.includes(s)).map((s) =>
    s === 'paper' ? paperOrder(purchase) : s === 'esl' ? eslOrder(esl) : screenOrder(screens),
  );
  const today = groups.reduce((sum, g) => sum + g.today, 0);
  const monthly = groups.reduce((sum, g) => sum + g.monthly, 0);

  const placeOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPlaced();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, PROCESSING_MS);
  };

  const summary = (
    <>
      {groups.map((g) => (
        <section key={g.solution} className={`${card.section} ${styles.group}`}>
          <div className={styles.groupHead}>
            <Illustration id={g.solution} className={styles.groupArt} />
            <h3>{SOLUTION_NAMES[g.solution]}</h3>
            <span className={styles.groupTotal}>
              {money(g.today)}
              {g.monthly > 0 && <small> + {money(g.monthly)} / month</small>}
            </span>
          </div>
          {g.sections.length === 0 ? (
            <p className={card.sectionIntro}>Nothing to buy for {SOLUTION_NAMES[g.solution]} yet. You can order printers and paper later.</p>
          ) : (
            <table className={choice.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              {g.sections.map((section) => (
                <tbody key={section.title}>
                  <tr className={styles.sectionRow}>
                    <td colSpan={4}>{section.title}</td>
                  </tr>
                  {section.lines.map((l, i) => (
                    <tr key={`${l.name}-${i}`}>
                      <td>
                        {l.name}
                        {l.detail && <small>{l.detail}</small>}
                      </td>
                      <td>{l.qty.toLocaleString()}</td>
                      <td>{l.note ?? `${money(l.unit)}${l.monthly ? ' / month' : ''}`}</td>
                      <td>{l.note ? money(0) : `${money(l.total)}${l.monthly ? ' / month' : ''}`}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          )}
        </section>
      ))}

      <section className={`${card.section} ${styles.totals}`}>
        <div>
          <span>Starting package, paid today</span>
          <strong>{money(today)}</strong>
        </div>
        {monthly > 0 && (
          <div>
            <span>Printer lease, monthly</span>
            <strong>{money(monthly)} / month</strong>
          </div>
        )}
        <p className={choice.muted}>
          Demonstration pricing, excludes GST. Your three-month Ticket-IT subscription starts at activation, subject to the commercial policy
          being confirmed.
        </p>
      </section>
    </>
  );

  if (placed) {
    return (
      <div className={card.card}>
        <div className={styles.confirm}>
          <span className={styles.tick}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <h2>Your Ticket-IT setup is ready.</h2>
          <p>Let&apos;s add your products and prices.</p>
          <div className={styles.chips}>
            {groups.map((g) => (
              <span key={g.solution} className={choice.badge}>
                {SOLUTION_NAMES[g.solution]}
              </span>
            ))}
          </div>
          <small>Order TIT-20481 · {money(today)} paid · confirmation sent to your email</small>
        </div>
        {summary}
        <StepFooter onBack={onBack} nextLabel={nextLabel} onNext={onNext} />
      </div>
    );
  }

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Review your order</h2>
        <p className={card.subline}>Everything you chose, in one order. Check it over, then place your order.</p>
      </div>

      {summary}

      {processing && (
        <div className={choice.note} role="status">
          <span className={choice.spinner} />
          <span>Processing your order...</span>
        </div>
      )}

      <StepFooter onBack={onBack} nextLabel={processing ? 'Placing order...' : 'Place order'} onNext={processing ? () => undefined : placeOrder} />
    </div>
  );
};

export default OrderStep;
