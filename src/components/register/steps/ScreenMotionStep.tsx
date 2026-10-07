"use client";

import React, { useRef, useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import choice from '../ui/Choice.module.css';
import tabsCss from './FontLayoutStep.module.css';
import styles from './ScreenMotionStep.module.css';
import Carousel from '../ui/Carousel';
import ScreenContent, { screenWidthAt } from '../ui/ScreenContent';
import StepFooter from '../ui/StepFooter';
import TicketTabs from '../ui/TicketTabs';
import { ESL_LAYOUTS, EslLayoutId, findScreen, SCREEN_SHAPES, ScreenModel } from '../devices';
import { TICKET_FONTS } from '../fonts';
import { selectedScreens } from '../pricing';
import { SAMPLE_PRODUCTS } from '../products';
import { ScreenTicketDef, screenTickets } from '../screenTickets';
import { BrandSetup, brandColours, ScreenLayout, ScreenMotion, ScreenSetup } from '../state';

interface ScreenMotionStepProps {
  value: ScreenSetup;
  onChange: (value: ScreenSetup) => void;
  brand: BrandSetup;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const CAROUSEL_HEIGHT = 220;
const PREVIEW_HEIGHT: Record<ScreenModel['shape'], number> = { bar: 160, wide: 340, portrait: 520 };

/** Font, a text layout per ticket, motion and Multi Product, previewed on each chosen screen. Laid out like the ESL font step. */
const ScreenMotionStep: React.FC<ScreenMotionStepProps> = ({ value: saved, onChange, brand, onBack, onNext, nextLabel }) => {
  // Older saved state may not have the newer fields
  const value: ScreenSetup = {
    ...saved,
    fontIndex: saved.fontIndex ?? 1,
    fontChosen: saved.fontChosen ?? false,
    layouts: saved.layouts ?? {},
    layoutsChosen: saved.layoutsChosen ?? [],
  };
  const [screenId, setScreenId] = useState('');
  const [activeKey, setActiveKey] = useState('everyday');
  const [showErrors, setShowErrors] = useState(false);
  const fontRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLElement>(null);
  const set = (patch: Partial<ScreenSetup>) => onChange({ ...value, ...patch });

  const font = TICKET_FONTS[value.fontIndex];
  const lines = selectedScreens(value);
  const models = lines.length ? lines.map((l) => l.model) : [findScreen('zkl290')!];
  const designModel = models.find((m) => m.shape !== 'bar') ?? models[0];
  const model = models.find((m) => m.id === screenId) ?? models[0];
  const tickets = screenTickets(value);
  const active = tickets.find((t) => t.key === activeKey) ?? tickets[0];

  const layoutOf = (t: ScreenTicketDef) => {
    const l = value.layouts[t.key];
    return l && t.layouts.includes(l) ? l : t.recommended;
  };
  // Uploaded artwork is shown as it is, so it needs no text layout
  const chosen = (t: ScreenTicketDef) => !!t.upload || value.layoutsChosen.includes(t.key);
  const missing = tickets.filter((t) => !chosen(t));

  const moveLayout = (t: ScreenTicketDef, layout: EslLayoutId) =>
    set({ layouts: { ...value.layouts, [t.key]: layout }, layoutsChosen: value.layoutsChosen.filter((k) => k !== t.key) });
  const tickLayout = (t: ScreenTicketDef) =>
    set({
      layouts: { ...value.layouts, [t.key]: layoutOf(t) },
      layoutsChosen: value.layoutsChosen.includes(t.key) ? value.layoutsChosen.filter((k) => k !== t.key) : [...value.layoutsChosen, t.key],
    });

  const screen = (
    m: ScreenModel,
    t: ScreenTicketDef,
    height: number,
    opts: { layout?: EslLayoutId; fontFamily?: string; live?: boolean; maxWidth?: number } = {},
  ) => (
    <div style={{ width: Math.min(screenWidthAt(m, height), opts.maxWidth ?? Infinity), maxWidth: '100%' }}>
      <ScreenContent
        model={m}
        mode={t.mode}
        style={t.style}
        header={t.header}
        {...brandColours(brand, t.mode)}
        logoUrl={brand.logoUrl}
        upload={t.upload}
        motion={opts.live ? value.motion : 'static'}
        layout={opts.live ? value.layout : 'single'}
        textLayout={opts.layout ?? layoutOf(t)}
        fontFamily={opts.fontFamily ?? font.family}
        products={SAMPLE_PRODUCTS}
        maxHeight={height}
        maxWidth={opts.maxWidth}
      />
    </div>
  );

  const segmented = <T extends string>(options: { id: T; label: string }[], current: T, onPick: (v: T) => void) => (
    <div className={choice.segmented}>
      {options.map((o) => (
        <button type="button" key={o.id} className={current === o.id ? choice.on : ''} onClick={() => onPick(o.id)}>
          {o.label}
        </button>
      ))}
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
        <h2 className={card.headline}>Select your screen font and text layout</h2>
        <p className={card.subline}>Pick a font, choose how the text sits on each screen design, then how your content moves</p>
      </div>

      <section className={card.section} ref={fontRef}>
        <h3 className={card.sectionTitle}>Pick a Google Font</h3>
        <Carousel
          items={TICKET_FONTS}
          index={value.fontIndex}
          onIndexChange={(fontIndex) => set({ fontIndex, fontChosen: false })}
          selected={value.fontChosen}
          onSelect={() => set({ fontChosen: !value.fontChosen })}
          label="screen font"
          height={CAROUSEL_HEIGHT}
          renderItem={(f) => screen(designModel, { ...tickets[0], upload: undefined }, CAROUSEL_HEIGHT, { fontFamily: f.family, layout: 'product', maxWidth: 560 })}
        />
        <p className={tabsCss.layoutCaption}>
          <strong>{font.name}</strong>. {value.fontChosen ? 'Font is chosen.' : 'Tick the circle to choose it.'}
        </p>
      </section>

      <section className={card.section} ref={layoutRef}>
        <h3 className={card.sectionTitle}>Pick a text layout for each ticket</h3>
        <p className={card.sectionIntro}>
          The layout decides where the product, price and offer sit. Each ticket is shown on the screen design you picked in the last step.
        </p>
        <TicketTabs
          tickets={tickets.map((t) => ({ key: t.key, name: t.name, promo: t.mode === 'promo', ticked: chosen(t) }))}
          activeKey={active.key}
          onChange={setActiveKey}
        />
        {active.upload ? (
          <p className={styles.uploadNote}>Your {active.name} content is uploaded artwork, so it is shown as it is and needs no text layout.</p>
        ) : (
          <>
            <Carousel
              key={active.key}
              items={active.layouts}
              index={Math.max(0, active.layouts.indexOf(layoutOf(active)))}
              onIndexChange={(i) => moveLayout(active, active.layouts[i])}
              selected={chosen(active)}
              onSelect={() => tickLayout(active)}
              label={`${active.name} text layout`}
              height={CAROUSEL_HEIGHT}
              renderItem={(l) => screen(designModel, active, CAROUSEL_HEIGHT, { layout: l, maxWidth: 560 })}
            />
            <p className={tabsCss.layoutCaption}>
              <strong>{ESL_LAYOUTS[layoutOf(active)].name}</strong>
              {layoutOf(active) === active.recommended && active.mode === 'promo' && ' · Recommended'}. {ESL_LAYOUTS[layoutOf(active)].description}
            </p>
          </>
        )}
        {showErrors && errorText && value.fontChosen && <p className={form.error}>{errorText}</p>}
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Motion and layout</h3>
        <div className={styles.options}>
          <div>
            <span className={form.label}>Content</span>
            {segmented<ScreenMotion>(
              [
                { id: 'static', label: 'Static' },
                { id: 'animated', label: 'Animated' },
              ],
              value.motion,
              (motion) => set({ motion }),
            )}
            <p className={choice.muted}>{value.motion === 'animated' ? 'Products rotate on screen.' : 'One still image per screen.'}</p>
          </div>
          <div>
            <span className={form.label}>Layout</span>
            {segmented<ScreenLayout>(
              [
                { id: 'single', label: 'Single product' },
                { id: 'multi', label: 'Multi Product' },
              ],
              value.layout,
              (layout) => set({ layout }),
            )}
            <p className={choice.muted}>{value.layout === 'single' ? 'One hero product at a time.' : 'Several products on screen together.'}</p>
          </div>
        </div>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Preview on your screens</h3>
        <p className={card.sectionIntro}>The {active.name} content on each screen you chose. Switch tickets with the tabs above.</p>
        <div className={styles.screenTabs} role="tablist" aria-label="Screens">
          {models.map((m) => (
            <button
              type="button"
              role="tab"
              key={m.id}
              aria-selected={model.id === m.id}
              className={`${styles.screenTab} ${model.id === m.id ? styles.screenTabOn : ''}`}
              onClick={() => setScreenId(m.id)}
            >
              {m.size} {m.model}
            </button>
          ))}
        </div>
        <div className={styles.previewStage}>{screen(model, active, PREVIEW_HEIGHT[model.shape], { live: true })}</div>
        <p className={`${choice.muted} ${styles.caption}`}>
          {model.size} {model.model} · {SCREEN_SHAPES[model.shape].title} · shown at {model.width} × {model.height} px
          {model.shape === 'portrait' && '. Final playback orientation to be confirmed.'}
        </p>
      </section>

      <StepFooter onBack={onBack} nextLabel={nextLabel} onNext={handleNext} error={showErrors ? errorText : ''} />
    </div>
  );
};

export default ScreenMotionStep;
