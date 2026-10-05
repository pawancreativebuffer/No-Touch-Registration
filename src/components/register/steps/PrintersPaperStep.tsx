"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import styles from './PrintersPaperStep.module.css';
import CheckCircle from '../ui/CheckCircle';
import SheetPreview from '../ui/SheetPreview';
import StepFooter from '../ui/StepFooter';
import { findSize, money, PAPER_COLOURS, PAPER_PRODUCTS, Printer, PRINTERS } from '../data';
import { PurchaseSetup } from '../state';

interface PrintersPaperStepProps {
  value: PurchaseSetup;
  onChange: (value: PurchaseSetup) => void;
  onBack: () => void;
  onFinish: () => void;
}

const PrinterArt: React.FC<{ kind: Printer['kind'] }> = ({ kind }) => (
  <svg viewBox="0 0 120 130" className={styles.printerArt} aria-hidden="true">
    {kind === 'colour' && (
      <>
        <rect x="14" y="6" width="92" height="22" rx="3" fill="#e9eaee" stroke="#b8bcc6" />
        <rect x="6" y="22" width="30" height="16" rx="2" fill="#3b4a5a" />
      </>
    )}
    <rect x="10" y={kind === 'colour' ? 30 : 14} width="100" height={kind === 'colour' ? 56 : 62} rx="5" fill="#f1f2f5" stroke="#b8bcc6" />
    <rect x="28" y={kind === 'colour' ? 36 : 20} width="64" height="10" rx="2" fill="#3b4a5a" />
    <rect x="18" y="60" width="84" height="22" rx="2" fill="#e3e5ea" stroke="#c4c8d0" />
    <rect x="12" y="88" width="96" height="36" rx="3" fill="#e9eaee" stroke="#b8bcc6" />
    <line x1="22" y1="106" x2="98" y2="106" stroke="#c4c8d0" />
    {kind === 'colour' && <rect x="94" y="40" width="8" height="4" fill="#dc3238" />}
  </svg>
);

const PrintersPaperStep: React.FC<PrintersPaperStepProps> = ({ value, onChange, onBack, onFinish }) => {
  // Colour and quantity chosen on each paper row before it is added to the cart
  const [paperColour, setPaperColour] = useState<Record<string, string>>({});
  const [paperQty, setPaperQty] = useState<Record<string, number>>({});

  const qtyOf = (lineId: string) => value.quantities[lineId] ?? 1;
  const printerTotal = (p: Printer) => p.equipment.reduce((sum, l) => sum + l.monthly * qtyOf(l.id), 0);
  const monthlyTotal = PRINTERS.filter((p) => value.printers.includes(p.id)).reduce((s, p) => s + printerTotal(p), 0);

  const togglePrinter = (id: string) =>
    onChange({
      ...value,
      printers: value.printers.includes(id) ? value.printers.filter((p) => p !== id) : [...value.printers, id],
    });

  const setQty = (lineId: string, qty: number) =>
    onChange({ ...value, quantities: { ...value.quantities, [lineId]: Math.max(1, Math.min(99, qty || 1)) } });

  const addToCart = (sizeId: string) => {
    const colour = paperColour[sizeId] ?? '#ffffff';
    const qty = paperQty[sizeId] ?? 1;
    const existing = value.cart.find((l) => l.sizeId === sizeId && l.colour === colour);
    onChange({
      ...value,
      cart: existing
        ? value.cart.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l))
        : [...value.cart, { sizeId, colour, qty }],
    });
  };

  const removeLine = (index: number) => onChange({ ...value, cart: value.cart.filter((_, i) => i !== index) });

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Buy Printers &amp; Paper</h2>
        <p className={card.subline}>Lease a printer and order perforated ticket stock delivered in two days</p>
      </div>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Need to order a printer?</h3>
        {PRINTERS.map((p) => {
          const selected = value.printers.includes(p.id);
          const total = printerTotal(p);
          return (
            <div key={p.id} className={`${styles.printer} ${selected ? styles.selected : ''}`}>
              <div className={styles.printerHead}>
                <PrinterArt kind={p.kind} />
                <div className={styles.description}>
                  <strong>{p.name}</strong>
                  <p>{p.description}</p>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Equipment Schedule</th>
                    <th>Monthly Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {p.equipment.map((l) => (
                    <tr key={l.id}>
                      <td>{l.name}</td>
                      <td>{money(l.monthly)}</td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          className={`${form.input} ${styles.qtyInput}`}
                          value={qtyOf(l.id)}
                          onChange={(e) => setQty(l.id, Number(e.target.value))}
                          aria-label={`${l.name} quantity`}
                        />
                      </td>
                      <td>{money(l.monthly * qtyOf(l.id))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.tables}>
                <table className={`${styles.table} ${styles.dark}`}>
                  <thead>
                    <tr>
                      <th>Print Schedule – fixed cost</th>
                      <th>60 months</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Print hardware lease (interest free finance)</td>
                      <td>{money(total)} / month</td>
                    </tr>
                  </tbody>
                </table>
                <table className={`${styles.table} ${styles.dark}`}>
                  <thead>
                    <tr>
                      <th>Print Schedule</th>
                      <th>Print Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.rates.map((r) => (
                      <tr key={r.label}>
                        <td>{r.label}</td>
                        <td>{r.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.addRow} onClick={() => togglePrinter(p.id)}>
                <CheckCircle checked={selected} label={`Add ${p.name} to my order`} />
                <span>Add the {p.name} to my order</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Need to order paper?</h3>
        <ul className={styles.papers}>
          {PAPER_PRODUCTS.map((sizeId) => {
            const size = findSize(sizeId)!;
            const colour = paperColour[sizeId];
            const qty = paperQty[sizeId] ?? 1;
            return (
              <li key={sizeId} className={styles.paper}>
                <div className={styles.paperSheet}>
                  <SheetPreview size={size} height={140} />
                </div>
                <div className={styles.paperOptions}>
                  <div className={styles.paletteRow}>
                    <span className={styles.paletteLabel}>Colour palette</span>
                    <div className={styles.palette}>
                      {PAPER_COLOURS.map((c) => (
                        <button
                          type="button"
                          key={c}
                          className={`${styles.colour} ${colour === c ? styles.colourOn : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setPaperColour({ ...paperColour, [sizeId]: c })}
                          aria-label={`Colour ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                  {colour && (
                    <button type="button" className={styles.clear} onClick={() => setPaperColour({ ...paperColour, [sizeId]: '' })}>
                      Clear selection
                    </button>
                  )}
                  <div className={styles.cartRow}>
                    <div className={styles.stepper}>
                      <button type="button" onClick={() => setPaperQty({ ...paperQty, [sizeId]: Math.max(1, qty - 1) })} aria-label="Decrease">
                        −
                      </button>
                      <span>{qty}</span>
                      <button type="button" onClick={() => setPaperQty({ ...paperQty, [sizeId]: qty + 1 })} aria-label="Increase">
                        +
                      </button>
                    </div>
                    <button type="button" className={`${form.button} ${styles.addButton}`} onClick={() => addToCart(sizeId)}>
                      <span className={form.buttonIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="20" r="1.5"></circle>
                          <circle cx="18" cy="20" r="1.5"></circle>
                          <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"></path>
                        </svg>
                      </span>
                      <span className={form.buttonText}>Add to cart</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Your order</h3>
        {value.printers.length === 0 && value.cart.length === 0 ? (
          <p className={card.sectionIntro}>Nothing added yet. Printers and paper are optional, you can order them later.</p>
        ) : (
          <ul className={styles.order}>
            {PRINTERS.filter((p) => value.printers.includes(p.id)).map((p) => (
              <li key={p.id}>
                <span>{p.name} lease</span>
                <strong>{money(printerTotal(p))} / month</strong>
                <button type="button" className={styles.remove} onClick={() => togglePrinter(p.id)} aria-label={`Remove ${p.name}`}>
                  ×
                </button>
              </li>
            ))}
            {value.cart.map((l, i) => {
              const size = findSize(l.sizeId)!;
              return (
                <li key={`${l.sizeId}-${l.colour}`}>
                  <span>
                    <i className={styles.dot} style={{ backgroundColor: l.colour }} />
                    {[size.name, size.up].filter(Boolean).join(' ')} paper ({size.dims})
                  </span>
                  <strong>× {l.qty}</strong>
                  <button type="button" className={styles.remove} onClick={() => removeLine(i)} aria-label="Remove">
                    ×
                  </button>
                </li>
              );
            })}
            {monthlyTotal > 0 && (
              <li className={styles.orderTotal}>
                <span>Printer lease total</span>
                <strong>{money(monthlyTotal)} / month</strong>
                <span />
              </li>
            )}
          </ul>
        )}
      </section>

      <StepFooter onBack={onBack} nextLabel="Finish & Login" onNext={onFinish} />
    </div>
  );
};

export default PrintersPaperStep;
