"use client";

import React, { useRef, useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import styles from './FontLayoutStep.module.css';
import Carousel from '../ui/Carousel';
import TicketBackground from '../ui/TicketBackground';
import TicketPreview from '../ui/TicketPreview';
import StepFooter from '../ui/StepFooter';
import { DOWNLOADS, PROMO_HEADERS, SAMPLE_TICKET, TestTicket, TEXT_LAYOUTS } from '../data';
import { TICKET_FONTS } from '../fonts';
import { BackgroundSetup, FontSetup } from '../state';

interface FontLayoutStepProps {
  value: FontSetup;
  onChange: (value: FontSetup) => void;
  promo: BackgroundSetup;
  onBack: () => void;
  onNext: () => void;
  onOrderStock: () => void;
}

const TICKET_FIELDS: { key: keyof TestTicket; label: string; type?: string }[] = [
  { key: 'offer', label: 'Offer' },
  { key: 'description', label: 'Description' },
  { key: 'deal', label: 'Deal' },
  { key: 'price', label: 'Price' },
  { key: 'unit', label: 'Unit' },
  { key: 'startDate', label: 'Offer Start Date', type: 'date' },
  { key: 'endDate', label: 'Offer End Date', type: 'date' },
];

// Layout cards use one fixed font so changing the font carousel doesn't redraw them;
// the chosen font is applied on the "Build a Ticket" preview.
const LAYOUT_PREVIEW_FONT = TICKET_FONTS[1].family;

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

const FontLayoutStep: React.FC<FontLayoutStepProps> = ({ value, onChange, promo, onBack, onNext, onOrderStock }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const fontRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLElement>(null);
  const font = TICKET_FONTS[value.fontIndex];
  const layout = TEXT_LAYOUTS[value.layoutIndex];
  const promoHeader = promo.headers[0] ?? PROMO_HEADERS[0];

  const set = (patch: Partial<FontSetup>) => onChange({ ...value, ...patch });
  const setTicket = (key: keyof TestTicket, v: string) => set({ ticket: { ...value.ticket, [key]: v } });

  const testTicket = (
    <TicketPreview
      layout={layout}
      fontFamily={font.family}
      header={value.ticket.offer}
      colour1={promo.colour1}
      colour2={promo.colour2}
      ticket={value.ticket}
    />
  );

  const handleNext = () => {
    if (!value.fontChosen || !value.layoutChosen) {
      setShowErrors(true);
      (value.fontChosen ? layoutRef : fontRef).current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    onNext();
  };

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Select your font and text layout</h2>
        <p className={card.subline}>Pick a Google font and layout, then build a test ticket</p>
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
        <h3 className={card.sectionTitle}>Pick a text layout</h3>
        <Carousel
          items={TEXT_LAYOUTS}
          index={value.layoutIndex}
          onIndexChange={(layoutIndex) => set({ layoutIndex, layoutChosen: false })}
          selected={value.layoutChosen}
          onSelect={() => set({ layoutChosen: !value.layoutChosen })}
          label="text layout"
          height={300}
          renderItem={(l) => (
            <TicketPreview
              layout={l}
              fontFamily={LAYOUT_PREVIEW_FONT}
              header={l === 'variable' || l === 'variableWhite' ? 'Variable' : promoHeader}
              colour1={promo.colour1}
              colour2={promo.colour2}
              ticket={{ ...SAMPLE_TICKET, description: 'Description of product', deal: '2 for', price: '24.95', unit: '$25.95 Each' }}
            />
          )}
        />
        {showErrors && (!value.fontChosen || !value.layoutChosen) && (
          <p className={form.error}>Tick the circle under a font and a text layout to choose them.</p>
        )}
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Build a Ticket</h3>
        <p className={card.sectionIntro}>In-store price tickets sorted. Try your choices on a real ticket.</p>
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
          <div className={`${styles.builderPreview} ${styles.printArea}`}>{testTicket}</div>
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
        nextLabel="Buy Printers & Paper"
        onNext={handleNext}
        error={
          showErrors && (!value.fontChosen || !value.layoutChosen)
            ? 'Tick the circle under a font and a text layout to choose them.'
            : ''
        }
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
