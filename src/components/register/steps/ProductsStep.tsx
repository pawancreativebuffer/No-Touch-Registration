"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import choice from '../ui/Choice.module.css';
import bg from './BackgroundStep.module.css';
import styles from './ProductsStep.module.css';
import CheckCircle from '../ui/CheckCircle';
import Illustration, { IllustrationId } from '../ui/Illustrations';
import OutputShowcase from '../ui/OutputShowcase';
import StepFooter from '../ui/StepFooter';
import { money } from '../data';
import { Solution, SOLUTION_NAMES, SOLUTION_ORDER } from '../flow';
import { PRODUCT_TEMPLATE_CSV, RETAIL_SYSTEMS, RetailSystem, SAMPLE_PRODUCTS } from '../products';
import { BackgroundSetup, BrandSetup, DataSetup, EslSetup, FontSetup, ScreenSetup } from '../state';

type Method = 'spreadsheet' | 'system' | 'help';
type Phase = 'idle' | 'uploading' | 'preview' | 'connecting' | 'importing';

interface ProductsStepProps {
  value: DataSetup;
  onChange: (value: DataSetup) => void;
  solutions: Solution[];
  brand: BrandSetup;
  font: FontSetup;
  everyday: BackgroundSetup;
  promo: BackgroundSetup;
  esl: EslSetup;
  screens: ScreenSetup;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const METHODS: { id: Method; title: string; text: string; art: IllustrationId }[] = [
  { id: 'spreadsheet', title: 'Upload a spreadsheet', text: 'Download our template, fill in your products and upload it.', art: 'spreadsheet' },
  { id: 'system', title: 'Connect your retail system', text: 'Retail Express, Shopify, Lightspeed or Odoo. Products stay in sync.', art: 'system' },
  { id: 'help', title: 'Get help connecting', text: 'Our team will set up your product feed with you.', art: 'help' },
];

const STEP_MS = 1600;

const downloadTemplate = () => {
  const url = URL.createObjectURL(new Blob([PRODUCT_TEMPLATE_CSV], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ticket-it-products-template.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const ProductsStep: React.FC<ProductsStepProps> = ({ value, onChange, solutions, brand, font, everyday, promo, esl, screens, onBack, onNext, nextLabel }) => {
  const router = useRouter();
  const [method, setMethod] = useState<Method | null>(value.helpRequested && !value.imported ? 'help' : null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [fileName, setFileName] = useState('');
  const [system, setSystem] = useState<RetailSystem | null>(null);
  const [account, setAccount] = useState('');
  const [contact, setContact] = useState('Phone call');
  const [saved, setSaved] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const chosen = SOLUTION_ORDER.filter((s) => solutions.includes(s));
  const busy = phase === 'uploading' || phase === 'connecting' || phase === 'importing';

  const pickMethod = (m: Method) => {
    if (busy) return;
    setMethod(m);
    setPhase('idle');
  };

  const later = (fn: () => void, ms = STEP_MS) => setTimeout(fn, ms);

  const startUpload = (name: string) => {
    setFileName(name);
    setPhase('uploading');
    later(() => setPhase('preview'));
  };

  const importProducts = (source: string) => {
    setPhase('importing');
    later(() => {
      setPhase('idle');
      onChange({ ...value, imported: true, source });
    });
  };

  const connect = () => {
    if (!system) return;
    setPhase('connecting');
    later(() => importProducts(system.name));
  };

  const handleNext = () => {
    if (!value.imported && !value.helpRequested) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const productTable = (
    <table className={choice.table}>
      <thead>
        <tr>
          <th>SKU</th>
          <th style={{ textAlign: 'left' }}>Product</th>
          <th>Regular price</th>
          <th>Promotional price</th>
        </tr>
      </thead>
      <tbody>
        {SAMPLE_PRODUCTS.map((p) => (
          <tr key={p.sku}>
            <td style={{ textAlign: 'left' }}>{p.sku}</td>
            <td style={{ textAlign: 'left' }}>
              {p.name}
              <small>{p.size}</small>
            </td>
            <td>{money(p.price)}</td>
            <td>{money(p.offer)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const working = (text: string) => (
    <div className={styles.working} role="status">
      <div className={styles.workingText}>
        <span className={choice.spinner} />
        <span>{text}</span>
      </div>
      <div className={choice.progress}>
        <span />
      </div>
    </div>
  );

  const success = (text: string) => (
    <div className={choice.success}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>{text}</span>
    </div>
  );

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Add your products and prices</h2>
        <p className={card.subline}>Connect your product data once. Ticket-IT keeps every ticket, label and screen up to date.</p>
      </div>

      <section className={card.section}>
        <div className={choice.grid3}>
          {METHODS.map((m) => (
            <div
              key={m.id}
              className={`${choice.option} ${styles.method} ${method === m.id ? choice.selected : ''}`}
              onClick={() => pickMethod(m.id)}
            >
              <Illustration id={m.art} className={styles.methodArt} />
              <span className={choice.cardHead}>
                <CheckCircle checked={method === m.id} label={m.title} />
                <span className={choice.cardTitle}>
                  <strong>{m.title}</strong>
                </span>
              </span>
              <p className={choice.muted}>{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {method === 'spreadsheet' && (
        <section className={`${card.section} ${styles.panel}`}>
          <ol className={styles.steps}>
            <li>
              <span className={styles.num}>1</span>
              <div>
                <strong>Download the template</strong>
                <p className={choice.muted}>A spreadsheet with the columns Ticket-IT needs, pre-filled with sample products.</p>
                <button type="button" className={`${form.button} ${form.buttonSecondary} ${choice.inlineButton}`} onClick={downloadTemplate}>
                  <span className={form.buttonIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
                    </svg>
                  </span>
                  <span className={form.buttonText}>Download template</span>
                </button>
              </div>
            </li>
            <li>
              <span className={styles.num}>2</span>
              <div className={styles.grow}>
                <strong>Upload your spreadsheet</strong>
                {phase === 'uploading' ? (
                  working(`Uploading ${fileName}...`)
                ) : (
                  <>
                    <label className={bg.dropzone}>
                      <input
                        type="file"
                        accept=".csv,.xls,.xlsx"
                        hidden
                        onChange={(e) => e.target.files?.[0] && startUpload(e.target.files[0].name)}
                      />
                      <span>
                        <strong>{fileName ? fileName : 'Drop your CSV or Excel file here'}</strong>
                        <small>or click to browse</small>
                      </span>
                    </label>
                    {!fileName && (
                      <button type="button" className={`${form.link} ${styles.sample}`} onClick={() => startUpload('foodvilla-products.xlsx')}>
                        Use a sample file
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
            {(phase === 'preview' || phase === 'importing' || (value.imported && value.source === fileName)) && (
              <li>
                <span className={styles.num}>3</span>
                <div className={styles.grow}>
                  <strong>Check your products</strong>
                  <p className={choice.muted}>We found {SAMPLE_PRODUCTS.length} products in {fileName}.</p>
                  {productTable}
                  {phase === 'importing'
                    ? working(`Importing ${SAMPLE_PRODUCTS.length} products...`)
                    : !value.imported && (
                        <button type="button" className={`${form.button} ${choice.inlineButton} ${styles.action}`} onClick={() => importProducts(fileName)}>
                          <span className={form.buttonIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span className={form.buttonText}>Import {SAMPLE_PRODUCTS.length} products</span>
                        </button>
                      )}
                </div>
              </li>
            )}
          </ol>
        </section>
      )}

      {method === 'system' && (
        <section className={`${card.section} ${styles.panel}`}>
          <div className={styles.systems}>
            {RETAIL_SYSTEMS.map((s) => (
              <button
                type="button"
                key={s.id}
                className={`${styles.system} ${system?.id === s.id ? styles.systemOn : ''}`}
                onClick={() => {
                  if (busy) return;
                  setSystem(s);
                  setAccount('');
                }}
              >
                <span className={styles.systemMark} style={{ backgroundColor: s.colour }}>
                  {s.initials}
                </span>
                {s.name}
              </button>
            ))}
          </div>
          {system && (
            <div className={styles.connect}>
              {phase === 'connecting' ? (
                working(`Connecting to ${system.name}...`)
              ) : phase === 'importing' ? (
                <>
                  {success(`Connected to ${system.name}`)}
                  {working(`Importing products from ${system.name}...`)}
                </>
              ) : value.imported && value.source === system.name ? (
                <>
                  {success(`Connected to ${system.name}. Products and prices will stay in sync.`)}
                  {productTable}
                </>
              ) : (
                <div className={styles.connectForm}>
                  <div className={form.field}>
                    <label htmlFor="system-account" className={form.label}>{system.field}</label>
                    <input
                      id="system-account"
                      className={form.input}
                      placeholder={system.placeholder}
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                    />
                  </div>
                  <button type="button" className={`${form.button} ${choice.inlineButton}`} onClick={connect}>
                    <span className={form.buttonIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" />
                      </svg>
                    </span>
                    <span className={form.buttonText}>Connect {system.name}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {method === 'help' && (
        <section className={`${card.section} ${styles.panel}`}>
          {value.helpRequested ? (
            <>
              {success('Thanks! Our onboarding team will contact you within one business day to connect your products.')}
              <p className={`${choice.muted} ${styles.after}`}>You can carry on and finish setting up, or save and come back later.</p>
            </>
          ) : (
            <div className={styles.connectForm}>
              <div className={form.field}>
                <label htmlFor="help-contact" className={form.label}>How should we contact you?</label>
                <select id="help-contact" className={form.input} value={contact} onChange={(e) => setContact(e.target.value)}>
                  <option>Phone call</option>
                  <option>Email</option>
                  <option>Video call</option>
                </select>
              </div>
              <button type="button" className={`${form.button} ${choice.inlineButton}`} onClick={() => onChange({ ...value, helpRequested: true })}>
                <span className={form.buttonIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </span>
                <span className={form.buttonText}>Request help</span>
              </button>
            </div>
          )}
        </section>
      )}

      {value.imported && (
        <section className={card.section}>
          <h3 className={card.sectionTitle}>Your products, in your designs</h3>
          {success(
            `${SAMPLE_PRODUCTS.length} products imported from ${value.source}.${
              chosen.length > 1 ? ` One data source now feeds ${chosen.map((s) => SOLUTION_NAMES[s]).join(', ')}.` : ''
            }`,
          )}
          <div className={styles.showcase}>
            <OutputShowcase solutions={solutions} brand={brand} font={font} everyday={everyday} promo={promo} esl={esl} screens={screens} products={SAMPLE_PRODUCTS} height={280} />
          </div>
        </section>
      )}

      <section className={card.section}>
        <div className={styles.later}>
          <div>
            <strong>Not ready yet?</strong>
            <p className={choice.muted}>
              Save your setup and add products whenever you like. Your three-month Ticket-IT subscription starts at activation, subject to the
              commercial policy being confirmed.
            </p>
          </div>
          <button type="button" className={`${form.button} ${form.buttonSecondary} ${choice.inlineButton}`} onClick={() => setSaved(true)}>
            <span className={form.buttonIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
              </svg>
            </span>
            <span className={form.buttonText}>Save and finish later</span>
          </button>
        </div>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={showErrors && !value.imported && !value.helpRequested ? 'Add your products, request help, or choose Save and finish later.' : ''}
      />

      {saved && (
        <div className={styles.modal} role="dialog" aria-label="Setup saved">
          <div className={styles.modalCard}>
            <span className={styles.modalTick}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <h3>Your setup is saved</h3>
            <p>Log in any time to add your products and prices and go live. Your subscription will not start until you activate.</p>
            <div className={styles.modalActions}>
              <button type="button" className={`${form.button} ${form.buttonSecondary}`} onClick={() => setSaved(false)}>
                <span className={form.buttonText}>Keep going</span>
              </button>
              <button type="button" className={form.button} onClick={() => router.push('/')}>
                <span className={form.buttonText}>Go to login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsStep;
