"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import choice from '../ui/Choice.module.css';
import styles from './ScreenChooseStep.module.css';
import CheckCircle from '../ui/CheckCircle';
import Qty from '../ui/Qty';
import ScreenContent from '../ui/ScreenContent';
import StepFooter from '../ui/StepFooter';
import { money } from '../data';
import { SCREEN_MODELS, SCREEN_SHAPES, ScreenModel, ScreenShape } from '../devices';
import { screenCount, selectedScreens } from '../pricing';
import { SAMPLE_PRODUCTS } from '../products';
import { BrandSetup, ScreenSetup } from '../state';

interface ScreenChooseStepProps {
  value: ScreenSetup;
  onChange: (value: ScreenSetup) => void;
  brand: BrandSetup;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const SHAPE_ORDER: ScreenShape[] = ['bar', 'wide', 'portrait'];
const STAGE_HEIGHT: Record<ScreenShape, number> = { bar: 70, wide: 200, portrait: 320 };

const ScreenChooseStep: React.FC<ScreenChooseStepProps> = ({ value, onChange, brand, onBack, onNext, nextLabel }) => {
  const [showErrors, setShowErrors] = useState(false);

  const toggle = (m: ScreenModel) => {
    const on = value.selected.includes(m.id);
    const selected = on ? value.selected.filter((id) => id !== m.id) : [...value.selected, m.id];
    onChange({
      ...value,
      selected,
      qty: on ? value.qty : { ...value.qty, [m.id]: value.qty[m.id] || 1 },
    });
  };

  const setQty = (m: ScreenModel, qty: number) => {
    if (qty > 0 && !value.selected.includes(m.id)) {
      toggle(m);
      return;
    }
    onChange({
      ...value,
      qty: { ...value.qty, [m.id]: qty },
      selected: qty > 0 ? value.selected : value.selected.filter((id) => id !== m.id),
    });
  };

  const total = screenCount(value);
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
        <h2 className={card.headline}>Choose your Digital Screens</h2>
        <p className={card.subline}>Zkong Legendary screens. Each preview matches the screen&apos;s real shape and resolution.</p>
      </div>

      {SHAPE_ORDER.map((shape, si) => (
        <section key={shape} className={card.section}>
          <h3 className={card.sectionTitle}>{SCREEN_SHAPES[shape].title}</h3>
          <p className={card.sectionIntro}>{SCREEN_SHAPES[shape].description}</p>
          <div className={styles[shape]}>
            {SCREEN_MODELS.filter((m) => m.shape === shape).map((m, i) => {
              const checked = value.selected.includes(m.id);
              const promo = (si + i) % 2 === 1;
              return (
                <div key={m.id} className={`${choice.option} ${checked ? choice.selected : ''}`} onClick={() => toggle(m)}>
                  <div className={`${choice.stage} ${styles.stage}`} style={{ minHeight: STAGE_HEIGHT[shape] + 24 }}>
                    <ScreenContent
                      model={m}
                      mode={promo ? 'promo' : 'everyday'}
                      style={0}
                      colour1={promo ? brand.promo1 : brand.colour1}
                      colour2={promo ? brand.promo2 : brand.colour2}
                      header={promo ? 'Special' : 'Everyday Value'}
                      logoUrl={brand.logoUrl}
                      motion="static"
                      layout="single"
                      products={[SAMPLE_PRODUCTS[(si * 2 + i) % SAMPLE_PRODUCTS.length]]}
                      maxHeight={STAGE_HEIGHT[shape]}
                    />
                  </div>
                  <div className={choice.cardFoot}>
                    <div className={choice.cardHead}>
                      <CheckCircle checked={checked} label={`${m.size} ${m.model}`} />
                      <span className={choice.cardTitle}>
                        <strong>
                          {m.size} {m.model}
                        </strong>
                        <small>{m.resolution} pixels</small>
                      </span>
                    </div>
                    {m.integratedStand && <span className={`${choice.badge} ${choice.badgeGreen}`}>Integrated floor stand</span>}
                  </div>
                  <div className={choice.cardFoot}>
                    <span className={choice.price}>{money(m.price)} each</span>
                    <Qty value={checked ? value.qty[m.id] ?? 1 : 0} onChange={(q) => setQty(m, q)} label={`${m.model} quantity`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className={card.section}>
        <div className={choice.note}>
          {total > 0 ? (
            <>
              <strong>
                {total} screen{total === 1 ? '' : 's'} selected
              </strong>
              <span>{selectedScreens(value).map((l) => `${l.qty} × ${l.model.size} ${l.model.model}`).join(', ')}</span>
            </>
          ) : (
            <span>Tick a screen or set a quantity to add it to your package.</span>
          )}
        </div>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors && total === 0 ? 'Choose at least one screen and quantity.' : ''}
      />
    </div>
  );
};

export default ScreenChooseStep;
