"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import choice from '../ui/Choice.module.css';
import CheckCircle from '../ui/CheckCircle';
import EslLabel from '../ui/EslLabel';
import Qty from '../ui/Qty';
import StepFooter from '../ui/StepFooter';
import { money } from '../data';
import { ESL_MODELS, EslModel } from '../devices';
import { TICKET_FONTS } from '../fonts';
import { selectedEsls } from '../pricing';
import { SAMPLE_PRODUCTS } from '../products';
import { EslSetup } from '../state';

interface EslChooseStepProps {
  value: EslSetup;
  onChange: (value: EslSetup) => void;
  logoUrl: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const EslChooseStep: React.FC<EslChooseStepProps> = ({ value, onChange, logoUrl, onBack, onNext, nextLabel }) => {
  const [showErrors, setShowErrors] = useState(false);

  const toggle = (m: EslModel) => {
    const on = value.selected.includes(m.id);
    onChange({
      ...value,
      selected: on ? value.selected.filter((id) => id !== m.id) : [...value.selected, m.id],
      qty: on ? value.qty : { ...value.qty, [m.id]: value.qty[m.id] || m.defaultQty },
    });
  };

  const setQty = (m: EslModel, qty: number) =>
    onChange({
      ...value,
      qty: { ...value.qty, [m.id]: qty },
      selected: qty > 0 ? Array.from(new Set([...value.selected, m.id])) : value.selected.filter((id) => id !== m.id),
    });

  const lines = selectedEsls(value);
  const total = lines.reduce((sum, l) => sum + l.qty, 0);

  const handleNext = () => {
    if (total === 0) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Choose your Electronic Shelf Labels</h2>
        <p className={card.subline}>Pick every size you need and how many. You can mix sizes.</p>
      </div>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Zkong ESL sizes</h3>
        <p className={card.sectionIntro}>All five models display black, white, red and yellow. Previews are drawn at each label&apos;s real resolution.</p>
        <div className={choice.grid}>
          {ESL_MODELS.map((m, i) => {
            const checked = value.selected.includes(m.id);
            return (
              <div key={m.id} className={`${choice.option} ${checked ? choice.selected : ''}`} onClick={() => toggle(m)}>
                <div className={choice.stage} style={{ height: 230 }}>
                  <EslLabel
                    model={m}
                    mode={i % 2 ? 'promo' : 'everyday'}
                    style={0}
                    header={i % 2 ? 'Special' : 'Everyday Value'}
                    fontFamily={TICKET_FONTS[1].family}
                    layout="price"
                    logoUrl={logoUrl}
                    product={SAMPLE_PRODUCTS[i % SAMPLE_PRODUCTS.length]}
                    maxHeight={90 + m.inches * 13}
                  />
                </div>
                <div className={choice.cardHead}>
                  <CheckCircle checked={checked} label={`${m.size} ${m.model}`} />
                  <span className={choice.cardTitle}>
                    <strong>
                      {m.size} {m.model}
                    </strong>
                    <small>{m.resolution} pixels</small>
                  </span>
                </div>
                <div className={choice.cardFoot}>
                  <span className={choice.price}>{money(m.price)} each</span>
                  <Qty value={checked ? value.qty[m.id] ?? m.defaultQty : 0} onChange={(q) => setQty(m, q)} step={m.qtyStep} label={`${m.model} quantity`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={card.section}>
        <div className={choice.note}>
          {total > 0 ? (
            <>
              <strong>{total.toLocaleString()} labels selected</strong>
              <span>{lines.map((l) => `${l.qty} × ${l.model.size}`).join(', ')}</span>
            </>
          ) : (
            <span>Tick a size or set a quantity to add it to your ESL package.</span>
          )}
        </div>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors && total === 0 ? 'Choose at least one ESL size and quantity.' : ''}
      />
    </div>
  );
};

export default EslChooseStep;
