"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import choice from '../ui/Choice.module.css';
import Illustration from '../ui/Illustrations';
import Qty from '../ui/Qty';
import StepFooter from '../ui/StepFooter';
import { money } from '../data';
import { ESL_ACCESS_POINT, ESL_MODELS, ESL_SUBSCRIPTION } from '../devices';
import { eslAccessPoints, eslFixtures, eslLabelCount, eslOrder, eslSubscriptionTotal, fitsLabel, selectedEsls } from '../pricing';
import { EslSetup } from '../state';

interface EslBuyStepProps {
  value: EslSetup;
  onChange: (value: EslSetup) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const EslBuyStep: React.FC<EslBuyStepProps> = ({ value, onChange, onBack, onNext, nextLabel }) => {
  const lines = selectedEsls(value);
  const fixtures = eslFixtures(value);
  const ap = eslAccessPoints(value);
  const labels = eslLabelCount(value);
  const order = eslOrder(value);
  const [showErrors, setShowErrors] = useState(false);

  const handleNext = () => {
    onNext();
  };

  const setLabelQty = (id: string, qty: number) => {
    const selected = qty > 0
      ? (value.selected.includes(id) ? value.selected : [...value.selected, id])
      : value.selected.filter((s) => s !== id);
    onChange({
      ...value,
      qty: { ...value.qty, [id]: qty },
      selected,
    });
  };

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Your ESL package</h2>
        <p className={card.subline}>Select your shelf labels, fixtures and access points. Adjust anything you like.</p>
      </div>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Electronic Shelf Labels (ESLs)</h3>
        <p className={card.sectionIntro}>Select models and quantities for your store shelves.</p>
        <table className={choice.table}>
          <thead>
            <tr>
              <th>Model</th>
              <th>Price each</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ESL_MODELS.map((model) => {
              const qty = value.qty[model.id] ?? (value.selected.includes(model.id) ? model.defaultQty : 0);
              return (
                <tr key={model.id}>
                  <td>
                    {model.size} ESL {model.model}
                    <small>{model.resolution} px · black, white, red and yellow</small>
                  </td>
                  <td>{money(model.price)}</td>
                  <td>
                    <Qty value={qty} onChange={(q) => setLabelQty(model.id, q)} step={model.qtyStep} label={`${model.model} quantity`} />
                  </td>
                  <td>{money(model.price * qty)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Fixtures and fittings</h3>
        <p className={card.sectionIntro}>
          {labels > 0
            ? 'Recommended quantities are based on your labels. Set any fixture to 0 if you do not need it.'
            : 'Select ESL models above to see recommended shelf fixtures.'}
        </p>
        {fixtures.map(({ fixture, recommended, qty }) => (
          <div key={fixture.id} className={choice.item}>
            <Illustration id={fixture.id} className={choice.itemArt} />
            <div className={choice.itemText}>
              <strong>{fixture.name}</strong>
              <span>{fixture.description}</span>
              <small>
                {fitsLabel(fixture)} · {money(fixture.price)} each
                {recommended > 0 && ` · Recommended: ${recommended}`}
              </small>
            </div>
            <Qty
              value={qty}
              onChange={(q) => onChange({ ...value, fixtureQty: { ...value.fixtureQty, [fixture.id]: q } })}
              label={`${fixture.name} quantity`}
            />
            <span className={choice.itemTotal}>{money(fixture.price * qty)}</span>
          </div>
        ))}
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Access points</h3>
        <div className={choice.item}>
          <Illustration id="access-point" className={choice.itemArt} />
          <div className={choice.itemText}>
            <strong>{ESL_ACCESS_POINT.name}</strong>
            <span>{ESL_ACCESS_POINT.description}</span>
            <small>
              {money(ESL_ACCESS_POINT.price)} each · Recommended for {labels.toLocaleString()} labels: {ap.recommended}
            </small>
          </div>
          <Qty value={ap.qty} onChange={(q) => onChange({ ...value, apQty: q })} min={1} label="Access point quantity" />
          <span className={choice.itemTotal}>{money(ESL_ACCESS_POINT.price * ap.qty)}</span>
        </div>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Ticket-IT subscription</h3>
        <div className={choice.item}>
          <Illustration id="subscription" className={choice.itemArt} />
          <div className={choice.itemText}>
            <strong>3 months of Ticket-IT for ESL</strong>
            <span>Design, schedule and update every label from Ticket-IT. Starts when you activate.</span>
            <small>
              {labels.toLocaleString()} labels × ${ESL_SUBSCRIPTION.perLabelMonthly.toFixed(2)} per month × {ESL_SUBSCRIPTION.months} months
            </small>
          </div>
          <span className={choice.badge}>Included</span>
          <span className={choice.itemTotal}>{money(eslSubscriptionTotal(value))}</span>
        </div>
        <div className={choice.subtotal}>
          <span>ESL package total</span>
          <strong>{money(order.today)}</strong>
        </div>
        <p className={`${choice.muted} ${card.section}`} style={{ textAlign: 'right' }}>
          Demonstration pricing, excludes GST.
        </p>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors && labels === 0 ? 'Add at least one ESL, or go back and choose your sizes.' : ''}
      />
    </div>
  );
};

export default EslBuyStep;
