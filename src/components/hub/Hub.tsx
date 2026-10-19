"use client";

import React, { useEffect, useState } from 'react';
import form from '../ui/Form.module.css';
import styles from './Hub.module.css';
import HubWheel from './HubWheel';
import PaperTicket from '../register/ui/PaperTicket';
import PrintSizesStep from '../register/steps/PrintSizesStep';
import BackgroundStep from '../register/steps/BackgroundStep';
import BrandStep from '../register/steps/BrandStep';
import FontLayoutStep from '../register/steps/FontLayoutStep';
import PrintersPaperStep from '../register/steps/PrintersPaperStep';
import EslChooseStep from '../register/steps/EslChooseStep';
import EslDesignStep from '../register/steps/EslDesignStep';
import EslFontStep from '../register/steps/EslFontStep';
import EslBuyStep from '../register/steps/EslBuyStep';
import ScreenChooseStep from '../register/steps/ScreenChooseStep';
import ScreenDesignStep from '../register/steps/ScreenDesignStep';
import ScreenMotionStep from '../register/steps/ScreenMotionStep';
import ScreenBuyStep from '../register/steps/ScreenBuyStep';
import OrderStep from '../register/steps/OrderStep';
import { findSize, PROMO_TYPE_LAYOUT, PROMO_TYPES, STYLE_NAMES } from '../register/data';
import { eslFromPaper } from '../register/eslTickets';
import { Solution } from '../register/flow';
import { TICKET_FONTS } from '../register/fonts';
import { Orientation, PaperTicketDef, paperTickets } from '../register/paperTickets';
import { screensFromPaper } from '../register/screenTickets';
import {
  BackgroundSetup,
  BRAND_DEFAULTS,
  BrandSetup,
  brandColours,
  EMPTY_FONT,
  EMPTY_PRINT,
  EMPTY_PURCHASE,
  ESL_DEFAULTS,
  EslSetup,
  everydayDefaults,
  FontSetup,
  PrintSetup,
  promoDefaults,
  PurchaseSetup,
  SCREEN_DEFAULTS,
  ScreenSetup,
} from '../register/state';

type PanelId = 'everyday' | 'promo' | 'esl' | 'signage' | 'brand' | 'buy';
type View = 'everyday' | 'promo';

const icon = (d: string) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/** Each option holds the steps of the previous signup flow that belong to it */
const PANELS: { id: PanelId; title: string; text: string; colour: string; icon: React.ReactNode; steps: string[] }[] = [
  {
    id: 'everyday',
    title: 'Everyday Tickets',
    text: 'Design, size and layout',
    colour: '#f73582',
    icon: icon('M4 4h16v16H4zM4 9h16M8 13h8M10 16h4'),
    steps: ['Everyday Ticket Sizes', 'Build your Everyday Ticket'],
  },
  {
    id: 'promo',
    title: 'Promotional Tickets',
    text: 'Specials, sales and offers',
    colour: '#e5352b',
    icon: icon('M20 12l-8 8-8-8V4h8zM7.5 7.5h.01'),
    steps: ['Promotional Ticket Sizes', 'Build your Promotional Ticket'],
  },
  {
    id: 'esl',
    title: 'ESL',
    text: 'Electronic Shelf Labels',
    colour: '#2b253e',
    icon: icon('M3 7h18v10H3zM6 10h5M6 13h3M15 10h3v4h-3z'),
    steps: ['Choose your ESLs', 'Design your ESL tickets', 'ESL text layout', 'Fixtures and access points'],
  },
  {
    id: 'signage',
    title: 'Digital Signage',
    text: 'Screens in store',
    colour: '#1d8bd8',
    icon: icon('M3 4h18v12H3zM8 20h8M12 16v4'),
    steps: ['Choose your screens', 'Design your screen content', 'Screen layout and motion', 'Mounts and network'],
  },
  {
    id: 'brand',
    title: 'Brand, Colours & Fonts',
    text: 'Logo, colours and font',
    colour: '#58b97d',
    icon: icon('M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1-.8-1.4-.8-2.4 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01'),
    steps: ['Your brand', 'Select Font layout Test'],
  },
  {
    id: 'buy',
    title: 'Buy Paper & Hardware',
    text: 'Optional',
    colour: '#f5a623',
    icon: icon('M3 3h2l2.7 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6M9 21h.01M18 21h.01'),
    steps: ['Buy Printers & Paper', 'Review and checkout'],
  },
];

/** Promotional ticket shown before the retailer has built any promotion */
const DEFAULT_PROMO: Pick<PaperTicketDef, 'key' | 'name' | 'recommended'> & { style: number; header: string } = {
  key: PROMO_TYPES[0].id,
  name: PROMO_TYPES[0].name,
  recommended: PROMO_TYPE_LAYOUT[PROMO_TYPES[0].id],
  style: PROMO_TYPES[0].style,
  header: PROMO_TYPES[0].header,
};

/** The hub: a ready-made ticket the prospect can edit and print straight away, with the setup split into options they open in any order */
const Hub = () => {
  // Quick edit on the ready-made ticket
  const [name, setName] = useState('Fresh Bananas');
  const [price, setPrice] = useState('3.49');
  const [was, setWas] = useState('4.20');
  const [unit, setUnit] = useState('per kg');
  const [view, setView] = useState<View>('everyday');

  // The same setup the step-by-step signup collects
  const [brand, setBrand] = useState<BrandSetup>(BRAND_DEFAULTS);
  const [standardPrint, setStandardPrint] = useState<PrintSetup>(EMPTY_PRINT);
  const [promoPrint, setPromoPrint] = useState<PrintSetup>(EMPTY_PRINT);
  const [everyday, setEveryday] = useState<BackgroundSetup>(everydayDefaults);
  const [promo, setPromo] = useState<BackgroundSetup>(promoDefaults);
  const [font, setFont] = useState<FontSetup>(EMPTY_FONT);
  const [purchase, setPurchase] = useState<PurchaseSetup>(EMPTY_PURCHASE);
  const [esl, setEsl] = useState<EslSetup>(ESL_DEFAULTS);
  const [screens, setScreens] = useState<ScreenSetup>(SCREEN_DEFAULTS);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [panel, setPanel] = useState<PanelId | null>(null);
  const [step, setStep] = useState(0);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountDone, setAccountDone] = useState(false);

  // Pressing Alt on its own opens or closes the options wheel (Alt used with another key is ignored)
  useEffect(() => {
    let altAlone = false;
    const onDown = (e: KeyboardEvent) => {
      altAlone = e.key === 'Alt' && !e.repeat ? true : e.key === 'Alt' ? altAlone : false;
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt' && altAlone) {
        e.preventDefault();
        setWheelOpen((open) => !open);
      }
      altAlone = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  /* ---------- The live ticket, built from the setup ---------- */
  const promoView = view === 'promo';
  const tickets = paperTickets(brand, everyday, promo);
  const promoTicket = tickets.find((t) => t.promoType);
  const sizeId = (promoView ? promoPrint.sizes[0] : undefined) ?? standardPrint.sizes[0] ?? 'p-a4';
  const size = findSize(sizeId)!;
  const orientation: Orientation = size.id.startsWith('p-') ? 'portrait' : 'landscape';
  const activeFont = TICKET_FONTS[font.fontIndex];
  const priceValue = parseFloat(price) || 0;
  const wasValue = parseFloat(was) || priceValue;
  const data = { description: name, unit, price: priceValue, was: promoView ? wasValue : priceValue, qty: 2, footer: '' };

  const everydayTicket = tickets[0];
  const live = promoView
    ? promoTicket ?? {
        ...DEFAULT_PROMO,
        bg: () => ({ type: 'design' as const, kind: 'promo' as const, variant: DEFAULT_PROMO.style, header: DEFAULT_PROMO.header, ...brandColours(brand, 'promo'), logoUrl: brand.logoUrl }),
      }
    : everydayTicket;
  const liveLayout = font.layouts?.[live.key] ?? live.recommended;
  const liveBg = live.bg(orientation);
  const designName =
    liveBg.type === 'image' ? 'Uploaded artwork' : liveBg.kind === 'promo' ? STYLE_NAMES.promo[liveBg.variant] : STYLE_NAMES.everyday[liveBg.variant];

  // Printing (and saving as PDF from the print dialog) shows only the ticket; then offer an account
  const printTicket = () => {
    window.print();
    if (!accountDone) setAccountOpen(true);
  };

  /* ---------- Options ---------- */
  const solutions: Solution[] = ['paper', ...(esl.selected.length ? (['esl'] as Solution[]) : []), ...(screens.selected.length ? (['screens'] as Solution[]) : [])];

  const goStep = (id: PanelId, i: number) => {
    // ESL and screens start from the Paper designs the first time they are designed
    if (id === 'esl' && i === 1 && !esl.fromPaper && promo.promoTypes.length) setEsl(eslFromPaper(esl, promo, font));
    if (id === 'signage' && i === 1 && !screens.fromPaper && promo.promoTypes.length) setScreens(screensFromPaper(screens, everyday, promo, font));
    setStep(i);
    window.scrollTo({ top: document.getElementById('hub-panel')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const openPanel = (id: PanelId) => {
    setPanel(id);
    setStep(0);
    if (id === 'promo') setView('promo');
    if (id === 'everyday') setView('everyday');
    setTimeout(() => document.getElementById('hub-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const open = PANELS.find((p) => p.id === panel);
  const last = open ? step === open.steps.length - 1 : false;
  const nav = open
    ? {
        onBack: () => (step === 0 ? setPanel(null) : goStep(open.id, step - 1)),
        onNext: () => (last ? setPanel(null) : goStep(open.id, step + 1)),
        nextLabel: last ? 'Done' : open.steps[step + 1],
      }
    : { onBack: () => undefined, onNext: () => undefined, nextLabel: '' };

  // ESL and screens use the one font chosen in Brand, Colours & Fonts
  const eslValue = { ...esl, fontIndex: font.fontIndex };
  const screensValue = { ...screens, fontIndex: font.fontIndex };

  const panelStep = () => {
    switch (panel) {
      case 'everyday':
        return step === 0 ? (
          <PrintSizesStep key="standard" kind="Everyday" value={standardPrint} onChange={setStandardPrint} {...nav} />
        ) : (
          <BackgroundStep key="everyday" kind="everyday" value={everyday} onChange={setEveryday} brand={brand} sizes={standardPrint.sizes} {...nav} />
        );
      case 'promo':
        return step === 0 ? (
          <PrintSizesStep key="promo" kind="Promotional" value={promoPrint} onChange={setPromoPrint} {...nav} />
        ) : (
          <BackgroundStep key="promo" kind="promo" value={promo} onChange={setPromo} brand={brand} sizes={promoPrint.sizes} {...nav} />
        );
      case 'brand':
        return step === 0 ? (
          <BrandStep value={brand} onChange={setBrand} solutions={['paper', 'esl', 'screens']} {...nav} />
        ) : (
          <FontLayoutStep value={font} onChange={setFont} everyday={everyday} promo={promo} brand={brand} onOrderStock={() => openPanel('buy')} {...nav} />
        );
      case 'esl':
        return [
          <EslChooseStep key="c" value={eslValue} onChange={setEsl} logoUrl={brand.logoUrl} {...nav} />,
          <EslDesignStep key="d" value={eslValue} onChange={setEsl} brand={brand} {...nav} />,
          <EslFontStep key="f" value={eslValue} onChange={setEsl} brand={brand} brandFontIndex={font.fontIndex} {...nav} />,
          <EslBuyStep key="b" value={eslValue} onChange={setEsl} {...nav} />,
        ][step];
      case 'signage':
        return [
          <ScreenChooseStep key="c" value={screensValue} onChange={setScreens} brand={brand} {...nav} />,
          <ScreenDesignStep key="d" value={screensValue} onChange={setScreens} brand={brand} {...nav} />,
          <ScreenMotionStep key="m" value={screensValue} onChange={setScreens} brand={brand} brandFontIndex={font.fontIndex} {...nav} />,
          <ScreenBuyStep key="b" value={screensValue} onChange={setScreens} {...nav} />,
        ][step];
      case 'buy':
        return step === 0 ? (
          <PrintersPaperStep value={purchase} onChange={setPurchase} {...nav} />
        ) : (
          <OrderStep solutions={solutions} purchase={purchase} esl={esl} screens={screens} placed={orderPlaced} onPlaced={() => setOrderPlaced(true)} {...nav} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.hub}>
      <section className={styles.centre}>
        <div className={styles.titleBar}>
          <div>
            <h1>Your first ticket is ready</h1>
            <p>Type your product and price, then print it.</p>
          </div>
          <button type="button" className={`${form.button} ${styles.setupButton}`} onClick={() => setWheelOpen(true)}>
            <span className={form.buttonIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </span>
            <span className={form.buttonText}>
              Build your setup <kbd className={styles.kbd}>Alt</kbd>
            </span>
          </button>
        </div>

        <div className={styles.editor}>
          <div className={styles.fields}>
            <div className={styles.viewSwitch} role="tablist" aria-label="Ticket type">
              {(['everyday', 'promo'] as const).map((v) => (
                <button type="button" role="tab" key={v} aria-selected={view === v} className={view === v ? styles.viewOn : ''} onClick={() => setView(v)}>
                  {v === 'everyday' ? 'Everyday Ticket' : 'Promotional Ticket'}
                </button>
              ))}
            </div>
            <div className={form.field}>
              <label htmlFor="hub-name" className={form.label}>Product</label>
              <input id="hub-name" className={form.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
            </div>
            <div className={styles.row}>
              <div className={form.field}>
                <label htmlFor="hub-price" className={form.label}>{promoView ? 'Offer price' : 'Price'}</label>
                <input
                  id="hub-price"
                  className={form.input}
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              {promoView ? (
                <div className={form.field}>
                  <label htmlFor="hub-was" className={form.label}>Regular price</label>
                  <input
                    id="hub-was"
                    className={form.input}
                    inputMode="decimal"
                    value={was}
                    onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setWas(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              ) : (
                <div className={form.field}>
                  <label htmlFor="hub-unit" className={form.label}>Unit</label>
                  <input id="hub-unit" className={form.input} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. per kg" />
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <button type="button" className={form.button} onClick={printTicket}>
                <span className={form.buttonIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </span>
                <span className={form.buttonText}>Print</span>
              </button>
              <button type="button" className={`${form.button} ${form.buttonSecondary}`} onClick={printTicket}>
                <span className={form.buttonIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
                  </svg>
                </span>
                <span className={form.buttonText}>Download PDF</span>
              </button>
            </div>
            <p className={styles.hint}>
              To save a PDF, choose <strong>Save as PDF</strong> in the print window.
            </p>

            <dl className={styles.current}>
              <div>
                <dt>Ticket</dt>
                <dd>{live.name}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>
                  {[size.name, size.up].filter(Boolean).join(' ')}, {orientation}
                </dd>
              </div>
              <div>
                <dt>Design</dt>
                <dd>{designName}</dd>
              </div>
              <div>
                <dt>Font</dt>
                <dd>{activeFont.name}</dd>
              </div>
            </dl>

            <div className={styles.account}>
              {accountDone ? (
                <p className={styles.saved}>Your ticket style is saved to your account.</p>
              ) : (
                <>
                  <p>Want to keep this ticket style?</p>
                  <button type="button" className={`${form.link} ${styles.saveLink}`} onClick={() => setAccountOpen(true)}>
                    Create a free account
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.preview}>
            <div
              className={`${styles.ticketBox} ${styles.printArea}`}
              style={{ aspectRatio: `${size.cellW} / ${size.cellH}`, height: size.cellW >= size.cellH ? 'auto' : '100%', width: size.cellW >= size.cellH ? '100%' : 'auto' }}
            >
              <PaperTicket bg={liveBg} orientation={orientation} layout={liveLayout} data={data} fontFamily={activeFont.family} fill />
            </div>
          </div>
        </div>

        {open && (
          <div id="hub-panel" className={styles.panelWrap}>
            <div className={styles.panelBar}>
              <div className={styles.panelHead}>
                <h2>{open.title}</h2>
                <div className={styles.panelActions}>
                  <button type="button" className={form.link} onClick={() => setWheelOpen(true)}>
                    All options
                  </button>
                  <button type="button" className={styles.close} onClick={() => setPanel(null)} aria-label="Close">
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.subSteps} role="tablist" aria-label={`${open.title} steps`}>
                {open.steps.map((s, i) => (
                  <button
                    type="button"
                    role="tab"
                    key={s}
                    aria-selected={step === i}
                    className={`${styles.subStep} ${step === i ? styles.subStepOn : ''} ${i < step ? styles.subStepDone : ''}`}
                    onClick={() => goStep(open.id, i)}
                  >
                    <span>{i + 1}</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div key={`${open.id}-${step}`} className={styles.panelStep}>
              {panelStep()}
            </div>
          </div>
        )}
      </section>

      {wheelOpen && (
        <HubWheel
          options={PANELS}
          onPick={(id) => {
            openPanel(id as PanelId);
            setWheelOpen(false);
          }}
          onClose={() => setWheelOpen(false)}
        />
      )}

      {accountOpen && (
        <div className={styles.modal} role="dialog" aria-label="Create your account">
          <form
            className={styles.modalCard}
            onSubmit={(e) => {
              e.preventDefault();
              setAccountDone(true);
              setAccountOpen(false);
            }}
          >
            <h2>Save your ticket style</h2>
            <p>Create a free account to keep this ticket and carry on building your setup.</p>
            <div className={form.field}>
              <label htmlFor="acc-name" className={form.label}>Your name</label>
              <input id="acc-name" className={form.input} required />
            </div>
            <div className={form.field}>
              <label htmlFor="acc-email" className={form.label}>Email</label>
              <input id="acc-email" type="email" className={form.input} required />
            </div>
            <div className={form.field}>
              <label htmlFor="acc-password" className={form.label}>Password</label>
              <input id="acc-password" type="password" minLength={8} className={form.input} required />
            </div>
            <p className={styles.noCost}>Free to create. Nothing is charged until you choose to buy.</p>
            <div className={styles.modalActions}>
              <button type="button" className={`${form.button} ${form.buttonSecondary}`} onClick={() => setAccountOpen(false)}>
                <span className={form.buttonText}>Maybe later</span>
              </button>
              <button type="submit" className={form.button}>
                <span className={form.buttonText}>Create account</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Hub;
