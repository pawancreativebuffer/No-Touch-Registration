"use client";

import React, { useRef, useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import styles from './FontLayoutStep.module.css';
import Carousel from '../ui/Carousel';
import TicketBackground from '../ui/TicketBackground';
import PaperTicket, { TicketData } from '../ui/PaperTicket';
import StepFooter from '../ui/StepFooter';
import TicketTabs from '../ui/TicketTabs';
import { TICKET_LAYOUTS, TicketLayoutId } from '../data';
import { TICKET_FONTS } from '../fonts';
import { Orientation, PaperTicketDef, paperTickets } from '../paperTickets';
import { BackgroundSetup, BrandSetup, FontSetup } from '../state';

interface FontLayoutStepProps {
  value: FontSetup;
  onChange: (value: FontSetup) => void;
  /** Backgrounds picked on the Everyday and Promotional background steps */
  everyday: BackgroundSetup;
  promo: BackgroundSetup;
  brand: BrandSetup;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  onOrderStock?: () => void;
}

/** Sample product shown on the layout cards */
const SAMPLE_DATA: TicketData = { description: 'Fresh Bananas per kg', unit: '$4.20 / kg', price: 3.49, was: 4.2, qty: 2, footer: 'Available while stocks last' };

const FontLayoutStep: React.FC<FontLayoutStepProps> = ({ value: saved, onChange, everyday, promo, brand, onBack, onNext, nextLabel }) => {
  // Older saved state may not have the newer fields
  const value: FontSetup = {
    ...saved,
    layouts: saved.layouts ?? {},
    layoutsChosen: saved.layoutsChosen ?? [],
    ticket: { ...saved.ticket, was: saved.ticket.was ?? '45' },
  };
  const [showErrors, setShowErrors] = useState(false);
  const [activeKey, setActiveKey] = useState('everyday');
  const fontRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLElement>(null);
  const font = TICKET_FONTS[value.fontIndex];

  const tickets = paperTickets(brand, everyday, promo);
  const active = tickets.find((t) => t.key === activeKey) ?? tickets[0];
  const layoutOf = (t: PaperTicketDef) => value.layouts[t.key] ?? t.recommended;
  const chosen = (t: PaperTicketDef) => value.layoutsChosen.includes(t.key);
  const missing = tickets.filter((t) => !chosen(t));

  const set = (patch: Partial<FontSetup>) => onChange({ ...value, ...patch });

  // Sliding to another layout un-ticks it, like the other carousels
  const moveLayout = (t: PaperTicketDef, layout: TicketLayoutId) =>
    set({ layouts: { ...value.layouts, [t.key]: layout }, layoutsChosen: value.layoutsChosen.filter((k) => k !== t.key) });
  const tickLayout = (t: PaperTicketDef) =>
    set({ layouts: { ...value.layouts, [t.key]: layoutOf(t) }, layoutsChosen: chosen(t) ? value.layoutsChosen.filter((k) => k !== t.key) : [...value.layoutsChosen, t.key] });

  const ticketFor = (t: PaperTicketDef, o: Orientation, data: TicketData, layout = layoutOf(t), fill = false) => (
    <PaperTicket bg={t.bg(o)} orientation={o} layout={layout} data={data} fontFamily={font.family} fill={fill} />
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

  const layoutIndex = active.layouts.indexOf(layoutOf(active));

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Select your font and text layout</h2>
        <p className={card.subline}>Pick a Google font and choose how the text sits on each ticket</p>
      </div>

      <section className={card.section} ref={fontRef}>
        <h3 className={card.sectionTitle}>Pick a Google Font</h3>
        <Carousel
          items={TICKET_FONTS}
          index={value.fontIndex}
          onIndexChange={(fontIndex) => set({ fontIndex, fontChosen: false })}
          selected={value.fontChosen}
          onSelect={() => set({ fontChosen: !value.fontChosen })}
          label="font"
          height={270}
          renderItem={(f) => {
            const i = TICKET_FONTS.indexOf(f);
            return (
              <TicketBackground
                kind="promo"
                variant={i}
                orientation="portrait"
                header={['New', 'Special', 'New', 'Advertised', 'Special'][i % 5]}
                colour1={['#1aa3e0', '#4cb944', '#1aa3e0', '#f7e017', '#4cb944'][i % 5]}
                colour2={['#ffffff', '#ffffff', '#ffffff', '#f7e017', '#4cb944'][i % 5]}
              >
                <div className={styles.fontSample} style={{ fontFamily: f.family }}>
                  <span>Schriftbild</span>
                  <span>Schriftbild</span>
                  <span>Schriftbild</span>
                  <small>{f.name}</small>
                </div>
              </TicketBackground>
            );
          }}
        />
      </section>

      <section className={card.section} ref={layoutRef}>
        <h3 className={card.sectionTitle}>Pick a text layout for each ticket</h3>
        <p className={card.sectionIntro}>
          The layout decides where the product, price and offer sit. Each ticket is shown on the background you picked in the earlier steps.
        </p>
        <TicketTabs
          tickets={tickets.map((t) => ({ key: t.key, name: t.name, promo: !!t.promoType, ticked: chosen(t) }))}
          activeKey={active.key}
          onChange={setActiveKey}
        />
        <Carousel
          key={active.key}
          items={active.layouts}
          index={Math.max(0, layoutIndex)}
          onIndexChange={(i) => moveLayout(active, active.layouts[i])}
          selected={chosen(active)}
          onSelect={() => tickLayout(active)}
          label={`${active.name} text layout`}
          height={300}
          renderItem={(l) => ticketFor(active, 'portrait', SAMPLE_DATA, l)}
        />
        <p className={styles.layoutCaption}>
          <strong>{TICKET_LAYOUTS[layoutOf(active)].name}</strong>
          {layoutOf(active) === active.recommended && active.promoType && ' · Recommended'}. {TICKET_LAYOUTS[layoutOf(active)].description}
        </p>
        <div className={styles.orientations}>
          <figure>
            <div className={styles.orientPortrait}>{ticketFor(active, 'portrait', SAMPLE_DATA)}</div>
            <figcaption>Portrait</figcaption>
          </figure>
          <figure>
            <div className={styles.orientLandscape}>{ticketFor(active, 'landscape', SAMPLE_DATA)}</div>
            <figcaption>Landscape</figcaption>
          </figure>
        </div>
        {showErrors && errorText && value.fontChosen && <p className={form.error}>{errorText}</p>}
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors ? errorText : ''}
      />
    </div>
  );
};

export default FontLayoutStep;
