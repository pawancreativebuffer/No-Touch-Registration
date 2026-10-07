"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import choice from '../ui/Choice.module.css';
import bg from './BackgroundStep.module.css';
import styles from './EslDesignStep.module.css';
import Carousel from '../ui/Carousel';
import EslLabel, { ESL_STYLES, eslWidthAt } from '../ui/EslLabel';
import StepFooter from '../ui/StepFooter';
import TicketTabs from '../ui/TicketTabs';
import { PROMO_TYPES, PromoTypeId } from '../data';
import { ESL_MODELS, ESL_PROMO_DEFAULTS, EslModel, findEsl } from '../devices';
import { eslStyleOf, EslTicketDef, eslTickets } from '../eslTickets';
import { TICKET_FONTS } from '../fonts';
import { selectedEsls } from '../pricing';
import { SAMPLE_PRODUCTS } from '../products';
import { BrandSetup, EslSetup } from '../state';

interface EslDesignStepProps {
  value: EslSetup;
  onChange: (value: EslSetup) => void;
  brand: BrandSetup;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const CAROUSEL_HEIGHT = 240;

/** Design for ESL backgrounds: one Everyday design and a design per promotion, in black, white, red and yellow */
const EslDesignStep: React.FC<EslDesignStepProps> = ({ value, onChange, brand, onBack, onNext, nextLabel }) => {
  const [showErrors, setShowErrors] = useState(false);
  const [openType, setOpenType] = useState<PromoTypeId | null>(null);
  const [viewKey, setViewKey] = useState('everyday');
  const set = (patch: Partial<EslSetup>) => onChange({ ...value, ...patch });

  const lines = selectedEsls(value);
  const models = lines.length ? lines.map((l) => l.model) : ESL_MODELS.slice(0, 3);
  // Designs are shown on the first mid-size label the retailer chose
  const designModel = lines.find((l) => l.model.width >= 300)?.model ?? findEsl('zkc42q')!;
  const tickets = eslTickets(value);
  const viewing = tickets.find((t) => t.key === viewKey) ?? tickets[0];

  const blankLabel = (model: EslModel, t: Pick<EslTicketDef, 'mode' | 'style' | 'header'>, height: number) => (
    <div style={{ width: eslWidthAt(model, height), maxWidth: '100%' }}>
      <EslLabel
        model={model}
        mode={t.mode}
        style={t.style}
        header={t.header}
        fontFamily={TICKET_FONTS[value.fontIndex].family}
        logoUrl={brand.logoUrl}
        product={SAMPLE_PRODUCTS[0]}
        blank
        maxHeight={height}
      />
    </div>
  );

  const moveStyle = (id: PromoTypeId, style: number) => set({ typeStyles: { ...value.typeStyles, [id]: style } });
  const tickType = (id: PromoTypeId) =>
    set({ promoTypes: value.promoTypes.includes(id) ? value.promoTypes.filter((x) => x !== id) : [...value.promoTypes, id] });

  const ready = value.everydayChosen && value.promoTypes.length > 0;
  const errorText = !value.everydayChosen ? 'Tick an Everyday ESL design.' : 'Tick a design for at least one promotion.';
  const handleNext = () => {
    if (!ready) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const promoIndexes = ESL_STYLES.promo.map((_, i) => i);

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Design your ESL tickets</h2>
        <p className={card.subline}>Black and white for Everyday, red and yellow for promotions: the four colours every ESL shows</p>
      </div>

      {value.fromPaper && (
        <section className={card.section}>
          <div className={choice.note}>
            <strong>We brought across your Paper promotions.</strong>
            <span>
              Each promotion uses the same design you picked for Paper, in ESL colours. Everyday ESL labels are black and white, because textures
              cannot show on an ESL screen. Change anything you like.
            </span>
          </div>
        </section>
      )}

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Everyday ESL design</h3>
        <p className={card.sectionIntro}>One black and white design for all your Everyday labels. Red and yellow are kept for promotions.</p>
        <Carousel
          items={ESL_STYLES.everyday.map((_, i) => i)}
          index={value.everydayStyle}
          onIndexChange={(everydayStyle) => set({ everydayStyle, everydayChosen: false })}
          selected={value.everydayChosen}
          onSelect={() => set({ everydayChosen: !value.everydayChosen })}
          renderItem={(s) => blankLabel(designModel, { mode: 'everyday', style: s, header: tickets[0].header }, CAROUSEL_HEIGHT)}
          label="everyday ESL design"
          height={CAROUSEL_HEIGHT}
        />
        <p className={bg.accCaption}>
          <strong>{ESL_STYLES.everyday[value.everydayStyle]}</strong>. {value.everydayChosen ? 'Everyday design is chosen.' : 'Tick the circle to choose it.'}
        </p>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Promotional ESL designs</h3>
        <p className={card.sectionIntro}>One design for each promotion. Open a promotion, slide to the design you like and tick it to add it.</p>
        <div className={bg.accordion}>
          {PROMO_TYPES.map((t) => {
            const open = openType === t.id;
            const added = value.promoTypes.includes(t.id);
            const style = eslStyleOf(value, t.id);
            return (
              <div key={t.id} className={`${bg.accItem} ${open ? bg.accOpen : ''}`}>
                <button type="button" className={bg.accHead} aria-expanded={open} onClick={() => setOpenType(open ? null : t.id)}>
                  <strong className={bg.accTitle}>{t.name}</strong>
                  <span className={bg.accText}>{t.description}</span>
                  <span className={`${bg.accStatus} ${added ? bg.accAdded : ''}`}>
                    {added ? `Added · ${ESL_STYLES.promo[style]} design` : 'Not added'}
                  </span>
                  <span className={bg.chevron} aria-hidden="true" />
                </button>
                {open && (
                  <div className={bg.accBody}>
                    <Carousel
                      items={promoIndexes}
                      index={style}
                      onIndexChange={(i) => moveStyle(t.id, i)}
                      selected={added}
                      onSelect={() => tickType(t.id)}
                      renderItem={(s) => blankLabel(designModel, { mode: 'promo', style: s, header: t.header }, CAROUSEL_HEIGHT)}
                      label={`${t.name} ESL design`}
                      height={CAROUSEL_HEIGHT}
                    />
                    <p className={bg.accCaption}>
                      <strong>{ESL_STYLES.promo[style]}</strong>
                      {style === ESL_PROMO_DEFAULTS[t.id].style && ' · Recommended'}. {added ? `${t.name} is added.` : `Tick the circle to add ${t.name}.`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>How it looks on your ESLs</h3>
        <p className={card.sectionIntro}>Choose Everyday or a promotion to see its design on each ESL size you chose.</p>
        <TicketTabs
          tickets={tickets.map((t) => ({ key: t.key, name: t.name, promo: t.mode === 'promo' }))}
          activeKey={viewing.key}
          onChange={setViewKey}
        />
        <div className={styles.shelf}>
          {models.map((m) => (
            <figure key={m.id} className={styles.onShelf}>
              {blankLabel(m, viewing, 60 + m.inches * 22)}
              <figcaption>
                {m.size} {m.model} · {m.resolution} px
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <StepFooter onBack={onBack} nextLabel={nextLabel} onNext={handleNext} error={showErrors && !ready ? errorText : ''} />
    </div>
  );
};

export default EslDesignStep;
