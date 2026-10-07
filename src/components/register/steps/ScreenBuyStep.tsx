"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import choice from '../ui/Choice.module.css';
import styles from './ScreenBuyStep.module.css';
import Illustration from '../ui/Illustrations';
import Qty from '../ui/Qty';
import StepFooter from '../ui/StepFooter';
import { money } from '../data';
import { SCREEN_MOUNTS, SCREEN_SUBSCRIPTION } from '../devices';
import { mountFor, screenCount, screenNetwork, screenOrder, screenSubscriptionTotal, selectedScreens } from '../pricing';
import { ScreenSetup } from '../state';

interface ScreenBuyStepProps {
  value: ScreenSetup;
  onChange: (value: ScreenSetup) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const ScreenBuyStep: React.FC<ScreenBuyStepProps> = ({ value, onChange, onBack, onNext, nextLabel }) => {
  const [showErrors, setShowErrors] = useState(false);
  const lines = selectedScreens(value);
  const count = screenCount(value);
  const network = screenNetwork(value);
  const order = screenOrder(value);

  const setScreenQty = (id: string, qty: number) =>
    onChange({
      ...value,
      qty: { ...value.qty, [id]: qty },
      selected: qty > 0 ? value.selected : value.selected.filter((s) => s !== id),
    });

  const handleNext = () => {
    if (count === 0) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Your Digital Screens package</h2>
        <p className={card.subline}>We have matched mounting and network equipment to your screens. Adjust anything you like.</p>
      </div>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Selected screens</h3>
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
            {lines.map(({ model, qty }) => (
              <tr key={model.id}>
                <td>
                  {model.size} screen {model.model}
                  <small>{model.resolution} px</small>
                </td>
                <td>{money(model.price)}</td>
                <td>
                  <Qty value={qty} onChange={(q) => setScreenQty(model.id, q)} label={`${model.model} quantity`} />
                </td>
                <td>{money(model.price * qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Mounting brackets and stands</h3>
        {lines.map(({ model, qty }) => {
          const mount = mountFor(model, value);
          if (!mount) {
            return (
              <div key={model.id} className={choice.item}>
                <Illustration id="floor-stand" className={choice.itemArt} />
                <div className={choice.itemText}>
                  <strong>Integrated floor stand</strong>
                  <span>
                    The {model.size} {model.model} stands on its own base, so no bracket is needed.
                  </span>
                  <small>× {qty}</small>
                </div>
                <span className={`${choice.badge} ${choice.badgeGreen}`}>Included</span>
                <span className={choice.itemTotal}>{money(0)}</span>
              </div>
            );
          }
          return (
            <div key={model.id} className={choice.item}>
              <Illustration id={mount === 'clamp' ? 'clamp' : mount} className={choice.itemArt} />
              <div className={choice.itemText}>
                <strong>
                  {SCREEN_MOUNTS[mount].name} for {model.size} {model.model}
                </strong>
                <span>{SCREEN_MOUNTS[mount].description}</span>
                <small>
                  {money(SCREEN_MOUNTS[mount].price)} each × {qty}
                </small>
                {model.shape === 'wide' && (
                  <div className={`${choice.segmented} ${styles.mountChoice}`}>
                    {(['wall', 'ceiling'] as const).map((m) => (
                      <button
                        type="button"
                        key={m}
                        className={mount === m ? choice.on : ''}
                        onClick={() => onChange({ ...value, wideMount: { ...value.wideMount, [model.id]: m } })}
                      >
                        {SCREEN_MOUNTS[m].name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className={choice.muted}>One per screen</span>
              <span className={choice.itemTotal}>{money(SCREEN_MOUNTS[mount].price * qty)}</span>
            </div>
          );
        })}
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Network equipment for Digital Screens</h3>
        {network.map(({ item, recommended, qty }) => (
          <div key={item.id} className={choice.item}>
            <Illustration id={item.id === 'screen-ap' ? 'screen-ap' : 'poe-switch'} className={choice.itemArt} />
            <div className={choice.itemText}>
              <strong>{item.name}</strong>
              <span>{item.description}</span>
              <small>
                {money(item.price)} each · {recommended > 0 ? `Recommended for ${count} screens: ${recommended}` : 'Optional'}
              </small>
            </div>
            <Qty
              value={qty}
              onChange={(q) => onChange({ ...value, networkQty: { ...value.networkQty, [item.id]: q } })}
              label={`${item.name} quantity`}
            />
            <span className={choice.itemTotal}>{money(item.price * qty)}</span>
          </div>
        ))}
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Ticket-IT subscription</h3>
        <div className={choice.item}>
          <Illustration id="subscription" className={choice.itemArt} />
          <div className={choice.itemText}>
            <strong>3 months of Ticket-IT for Digital Screens</strong>
            <span>Create content and update prices on every screen. Starts when you activate.</span>
            <small>
              {count} screens × ${SCREEN_SUBSCRIPTION.perScreenMonthly.toFixed(2)} per month × {SCREEN_SUBSCRIPTION.months} months
            </small>
          </div>
          <span className={choice.badge}>Included</span>
          <span className={choice.itemTotal}>{money(screenSubscriptionTotal(value))}</span>
        </div>
        <div className={choice.subtotal}>
          <span>Digital Screens package total</span>
          <strong>{money(order.today)}</strong>
        </div>
        <p className={choice.muted} style={{ textAlign: 'right' }}>
          Demonstration pricing, excludes GST.
        </p>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors && count === 0 ? 'Add at least one screen, or go back and choose your screens.' : ''}
      />
    </div>
  );
};

export default ScreenBuyStep;
