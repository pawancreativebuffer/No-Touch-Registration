"use client";

import React, { useRef, useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import tabs from './FontLayoutStep.module.css';
import esl from './EslDesignStep.module.css';
import Carousel from '../ui/Carousel';
import EslLabel, { eslWidthAt } from '../ui/EslLabel';
import StepFooter from '../ui/StepFooter';
import TicketTabs from '../ui/TicketTabs';
import { ESL_LAYOUTS, ESL_MODELS, EslLayoutId, EslModel, findEsl } from '../devices';
import { EslTicketDef, eslTickets } from '../eslTickets';
import { TICKET_FONTS } from '../fonts';
import { selectedEsls } from '../pricing';
import { SAMPLE_PRODUCTS } from '../products';
import { BrandSetup, EslSetup } from '../state';

interface EslFontStepProps {
  value: EslSetup;
  onChange: (value: EslSetup) => void;
  brand: BrandSetup;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

/** Font and text layout for each ESL ticket, shown on the ESL designs and sizes the retailer chose */
const EslFontStep: React.FC<EslFontStepProps> = ({ value: saved, onChange, brand, onBack, onNext, nextLabel }) => {
  // Older saved state may not have the newer fields
  const value: EslSetup = { ...saved, layouts: saved.layouts ?? {}, layoutsChosen: saved.layoutsChosen ?? [], fontChosen: saved.fontChosen ?? false };
  const [showErrors, setShowErrors] = useState(false);
  const [activeKey, setActiveKey] = useState('everyday');
  const fontRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLElement>(null);
  const set = (patch: Partial<EslSetup>) => onChange({ ...value, ...patch });

  const font = TICKET_FONTS[value.fontIndex];
  const lines = selectedEsls(value);
  const models = lines.length ? lines.map((l) => l.model) : ESL_MODELS.slice(0, 3);
  const designModel = lines.find((l) => l.model.width >= 300)?.model ?? findEsl('zkc42q')!;
  const multiModel = [...lines].reverse().find((l) => l.model.width >= 960)?.model ?? findEsl('zkc102b')!;
  const multiIsExample = !lines.some((l) => l.model.id === multiModel.id);

  const tickets = eslTickets(value);
  const active = tickets.find((t) => t.key === activeKey) ?? tickets[0];
  const layoutOf = (t: EslTicketDef) => value.layouts[t.key] ?? t.recommended;
  const chosen = (t: EslTicketDef) => value.layoutsChosen.includes(t.key);
  const missing = tickets.filter((t) => !chosen(t));

  const moveLayout = (t: EslTicketDef, layout: EslLayoutId) =>
    set({ layouts: { ...value.layouts, [t.key]: layout }, layoutsChosen: value.layoutsChosen.filter((k) => k !== t.key) });
  const tickLayout = (t: EslTicketDef) =>
    set({ layouts: { ...value.layouts, [t.key]: layoutOf(t) }, layoutsChosen: chosen(t) ? value.layoutsChosen.filter((k) => k !== t.key) : [...value.layoutsChosen, t.key] });

  const label = (model: EslModel, t: EslTicketDef, height: number, opts: { layout?: EslLayoutId; fontFamily?: string; multi?: boolean; maxWidth?: number } = {}) => (
    <div style={{ width: eslWidthAt(model, height), maxWidth: '100%' }}>
      <EslLabel
        model={model}
        mode={t.mode}
        style={t.style}
        header={t.header}
        fontFamily={opts.fontFamily ?? font.family}
        layout={opts.layout ?? layoutOf(t)}
        logoUrl={brand.logoUrl}
        product={SAMPLE_PRODUCTS[t.mode === 'promo' ? 0 : 1]}
        products={opts.multi ? SAMPLE_PRODUCTS.slice(0, 4) : undefined}
        maxHeight={height}
        maxWidth={opts.maxWidth}
      />
    </div>
  );

  const errorText = !value.fontChosen
    ? 'Tick the circle under a font to choose it.'
    : missing.length
      ? `Tick a text layout for ${missing.map((t) => t.name).join(', ')}.`
      : '';

  const handleNext = () => {
    if (errorText) {
      setShowErrors(true);
      (value.fontChosen ? layoutRef : fontRef).current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    onNext();
  };

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Select your ESL font and text layout</h2>
        <p className={card.subline}>Pick a font, then choose how the text sits on each ESL ticket</p>
      </div>

      <section className={card.section} ref={fontRef}>
        <h3 className={card.sectionTitle}>Pick a Google Font</h3>
        <Carousel
          items={TICKET_FONTS}
          index={value.fontIndex}
          onIndexChange={(fontIndex) => set({ fontIndex, fontChosen: false })}
          selected={value.fontChosen}
          onSelect={() => set({ fontChosen: !value.fontChosen })}
          label="ESL font"
          height={270}
          renderItem={(f) => label(designModel, tickets[0], 270, { fontFamily: f.family, layout: 'product' })}
        />
        <p className={tabs.layoutCaption}>
          <strong>{font.name}</strong>. {value.fontChosen ? 'Font is chosen.' : 'Tick the circle to choose it.'}
        </p>
      </section>

      <section className={card.section} ref={layoutRef}>
        <h3 className={card.sectionTitle}>Pick a text layout for each ticket</h3>
        <p className={card.sectionIntro}>
          The layout decides where the product, price and offer sit. Each ticket is shown on the ESL design you picked in the last step.
        </p>
        <TicketTabs
          tickets={tickets.map((t) => ({ key: t.key, name: t.name, promo: t.mode === 'promo', ticked: chosen(t) }))}
          activeKey={active.key}
          onChange={setActiveKey}
        />
        <Carousel
          key={active.key}
          items={active.layouts}
          index={Math.max(0, active.layouts.indexOf(layoutOf(active)))}
          onIndexChange={(i) => moveLayout(active, active.layouts[i])}
          selected={chosen(active)}
          onSelect={() => tickLayout(active)}
          label={`${active.name} text layout`}
          height={280}
          renderItem={(l) => label(designModel, active, 280, { layout: l })}
        />
        <p className={tabs.layoutCaption}>
          <strong>{ESL_LAYOUTS[layoutOf(active)].name}</strong>
          {layoutOf(active) === active.recommended && active.mode === 'promo' && ' · Recommended'}. {ESL_LAYOUTS[layoutOf(active)].description}
        </p>

        <h3 className={`${card.sectionTitle} ${tabs.blockTitle}`}>On your ESLs</h3>
        <p className={card.sectionIntro}>The {active.name} layout on each ESL size you chose.</p>
        <div className={esl.shelf}>
          {models.map((m) => (
            <figure key={m.id} className={esl.onShelf}>
              {label(m, active, 60 + m.inches * 22)}
              <figcaption>
                {m.size} {m.model} · {m.resolution} px
              </figcaption>
            </figure>
          ))}
        </div>
        {showErrors && errorText && value.fontChosen && <p className={form.error}>{errorText}</p>}
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Multi Product Ticket</h3>
        <p className={card.sectionIntro}>
          Show a range on one label, such as a multi-buy or category offer, in your {active.name} design
          {multiIsExample ? `. Example on the ${multiModel.size} ${multiModel.model}.` : ` on your ${multiModel.size} ${multiModel.model}.`}
        </p>
        <div className={esl.multi}>{label(multiModel, active, 340, { multi: true, maxWidth: 520 })}</div>
      </section>

      <StepFooter onBack={onBack} nextLabel={nextLabel} onNext={handleNext} error={showErrors ? errorText : ''} />
    </div>
  );
};

export default EslFontStep;
