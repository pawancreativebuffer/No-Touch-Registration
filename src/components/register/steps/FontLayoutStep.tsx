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
import { DOWNLOADS, TestTicket, TICKET_LAYOUTS, TicketLayoutId } from '../data';
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
  onOrderStock: () => void;
}

const TICKET_FIELDS: { key: keyof TestTicket; label: string; type?: string }[] = [
  { key: 'description', label: 'Description' },
  { key: 'deal', label: 'Deal' },
  { key: 'price', label: 'Price' },
  { key: 'was', label: 'Regular price' },
  { key: 'unit', label: 'Unit' },
  { key: 'startDate', label: 'Offer Start Date', type: 'date' },
  { key: 'endDate', label: 'Offer End Date', type: 'date' },
];

/** Sample product shown on the layout cards */
const SAMPLE_DATA: TicketData = { description: 'Fresh Bananas per kg', unit: '$4.20 / kg', price: 3.49, was: 4.2, qty: 2, footer: 'Available while stocks last' };

const formatDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
};

/** Ticket details from the Build a Ticket form */
const ticketData = (t: TestTicket): TicketData => {
  const start = formatDate(t.startDate);
  const end = formatDate(t.endDate);
  return {
    description: t.description,
    unit: t.unit,
    price: parseFloat(t.price) || 0,
    was: parseFloat(t.was) || 0,
    qty: parseInt(t.deal, 10) || 0,
    footer: start || end ? `Available ${start ? `from ${start} ` : ''}${end ? `until ${end}` : ''}` : 'Available while stocks last',
  };
};

const downloadFile = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const TEMPLATES: Record<string, () => void> = {
  'price-template': () =>
    downloadFile(
      'ticket-it-price-tickets.csv',
      'Offer,Description,Deal,Price,Unit,Offer Start Date,Offer End Date\nSpecial,Kosciuszko Pale Ale Stubbies 330mL,3 for,36.00,x 24 Pack,2026-10-01,2026-10-31\n',
      'text/csv',
    ),
  'store-template': () =>
    downloadFile('ticket-it-store-network.csv', 'Store ID,Store Name,Region,Address,Postcode,Contact Email\n', 'text/csv'),
  'bg-template': () =>
    downloadFile(
      'ticket-it-background-template.svg',
      `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297"><rect width="210" height="297" fill="#fff" stroke="#d42b2f"/><rect width="210" height="56" fill="#f6bfd6"/><text x="105" y="34" font-family="Arial" font-size="12" text-anchor="middle">Header area</text><rect x="10" y="66" width="190" height="221" fill="none" stroke="#999" stroke-dasharray="3 3"/><text x="105" y="180" font-family="Arial" font-size="9" fill="#999" text-anchor="middle">Keep price and text clear of this area</text></svg>`,
      'image/svg+xml',
    ),
};

const ICONS: Record<string, React.ReactNode> = {
  cloud: <path d="M7 18a5 5 0 0 1-.6-9.96A6 6 0 0 1 18 7a4.5 4.5 0 0 1-.5 11H7zm5-8v5m0 0l-2.5-2.5M12 15l2.5-2.5" />,
  users: <path d="M16 19v-1a4 4 0 0 0-8 0v1m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 8v-1a3 3 0 0 0-2-2.8M17 5.2a3 3 0 0 1 0 5.6M6 19v-1a3 3 0 0 1 2-2.8M7 5.2a3 3 0 0 0 0 5.6" />,
  share: <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />,
  truck: <path d="M1 4h14v11H1zm14 4h4l3 3v4h-7zM5.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm13 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
};

const FontLayoutStep: React.FC<FontLayoutStepProps> = ({ value: saved, onChange, everyday, promo, brand, onBack, onNext, nextLabel, onOrderStock }) => {
  // Older saved state may not have the newer fields
  const value: FontSetup = {
    ...saved,
    layouts: saved.layouts ?? {},
    layoutsChosen: saved.layoutsChosen ?? [],
    ticket: { ...saved.ticket, was: saved.ticket.was ?? '45' },
  };
  const [previewOpen, setPreviewOpen] = useState(false);
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
  const setTicket = (key: keyof TestTicket, v: string) => set({ ticket: { ...value.ticket, [key]: v } });

  // Sliding to another layout un-ticks it, like the other carousels
  const moveLayout = (t: PaperTicketDef, layout: TicketLayoutId) =>
    set({ layouts: { ...value.layouts, [t.key]: layout }, layoutsChosen: value.layoutsChosen.filter((k) => k !== t.key) });
  const tickLayout = (t: PaperTicketDef) =>
    set({ layouts: { ...value.layouts, [t.key]: layoutOf(t) }, layoutsChosen: chosen(t) ? value.layoutsChosen.filter((k) => k !== t.key) : [...value.layoutsChosen, t.key] });

  const ticketFor = (t: PaperTicketDef, o: Orientation, data: TicketData, layout = layoutOf(t), fill = false) => (
    <PaperTicket bg={t.bg(o)} orientation={o} layout={layout} data={data} fontFamily={font.family} fill={fill} />
  );

  const testData = ticketData(value.ticket);
  const testTicket = ticketFor(active, 'portrait', testData);

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
        <p className={card.subline}>Pick a Google font, choose how the text sits on each ticket, then build a test ticket</p>
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

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Build a Ticket</h3>
        <p className={card.sectionIntro}>
          Try your {active.name} ticket with a real product. Switch tickets with the tabs above.
        </p>
        <div className={styles.builder}>
          <div className={styles.builderForm}>
            {TICKET_FIELDS.map((f) => (
              <div key={f.key} className={form.field}>
                <label htmlFor={`ticket-${f.key}`} className={form.label}>{f.label}</label>
                <input
                  id={`ticket-${f.key}`}
                  type={f.type ?? 'text'}
                  className={form.input}
                  placeholder={`Enter ${f.label.toLowerCase()}`}
                  value={value.ticket[f.key]}
                  onChange={(e) => setTicket(f.key, e.target.value)}
                />
              </div>
            ))}
            <div className={styles.builderActions}>
              <button type="button" className={form.button} onClick={() => setPreviewOpen(true)}>
                <span className={form.buttonIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
                <span className={form.buttonText}>Preview</span>
              </button>
              <button type="button" className={`${form.button} ${form.buttonSecondary}`} onClick={() => window.print()}>
                <span className={form.buttonIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </span>
                <span className={form.buttonText}>Print</span>
              </button>
            </div>
          </div>
          <div className={`${styles.builderPreview} ${styles.printArea}`}>
            <div className={styles.builderPortrait}>{testTicket}</div>
            <div className={styles.builderLandscape}>{ticketFor(active, 'landscape', testData)}</div>
          </div>
        </div>
      </section>

      <section className={card.section}>
        <h3 className={`${card.sectionTitle} ${styles.splitTitle}`}>
          <span>Join Ticket-IT for free...</span>
          <span>Do more with Ticket-IT</span>
        </h3>
        <ul className={styles.downloads}>
          {DOWNLOADS.map((d) => (
            <li key={d.id}>
              <span className={styles.downloadIcon}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[d.icon]}
                </svg>
              </span>
              <span className={styles.downloadText}>{d.text}</span>
              <button
                type="button"
                className={styles.downloadAction}
                onClick={d.action === 'download' ? TEMPLATES[d.id] : onOrderStock}
                aria-label={d.action === 'download' ? 'Download' : 'Order'}
              >
                {d.action === 'download' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="20" r="1.5"></circle>
                    <circle cx="18" cy="20" r="1.5"></circle>
                    <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"></path>
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors ? errorText : ''}
      />

      {previewOpen && (
        <div className={styles.modal} onClick={() => setPreviewOpen(false)} role="dialog" aria-label="Ticket preview">
          <div className={styles.modalTicket}>{testTicket}</div>
          <p>Click anywhere to close</p>
        </div>
      )}
    </div>
  );
};

export default FontLayoutStep;
