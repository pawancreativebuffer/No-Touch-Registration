"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import choice from '../ui/Choice.module.css';
import bg from './BackgroundStep.module.css';
import styles from './BrandStep.module.css';
import StepFooter from '../ui/StepFooter';
import TicketBackground from '../ui/TicketBackground';
import EslLabel from '../ui/EslLabel';
import ScreenContent from '../ui/ScreenContent';
import { RETAIL_CATEGORIES } from '../data';
import { findEsl, findScreen } from '../devices';
import { Solution } from '../flow';
import { TICKET_FONTS } from '../fonts';
import { SAMPLE_PRODUCTS } from '../products';
import { BrandSetup, brandColours } from '../state';

const MAX_LOGO_BYTES = 2.5 * 1024 * 1024;

interface BrandStepProps {
  value: BrandSetup;
  onChange: (value: BrandSetup) => void;
  solutions: Solution[];
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

type ColourKey = 'colour1' | 'colour2' | 'promo1' | 'promo2';

const COLOUR_FIELDS: { key: ColourKey; label: string }[] = [
  { key: 'colour1', label: 'Brand colour 1' },
  { key: 'colour2', label: 'Brand colour 2' },
  { key: 'promo1', label: 'Promotional colour 1' },
  { key: 'promo2', label: 'Promotional colour 2' },
];

const BrandStep: React.FC<BrandStepProps> = ({ value, onChange, solutions, onBack, onNext, nextLabel }) => {
  const [logoError, setLogoError] = useState('');
  const [preview, setPreview] = useState<'everyday' | 'promo'>('everyday');
  const set = (patch: Partial<BrandSetup>) => onChange({ ...value, ...patch });

  const onLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Logo must be 2.5MB or smaller.');
      return;
    }
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setLogoError('Upload a JPEG or PNG file.');
      return;
    }
    setLogoError('');
    set({ logoName: file.name, logoUrl: URL.createObjectURL(file) });
  };

  const colours = brandColours(value, preview);
  const header = preview === 'everyday' ? 'Everyday Value' : 'Special';
  const product = SAMPLE_PRODUCTS[0];

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Tell us about your brand</h2>
        <p className={card.subline}>Add these once. We will use them on everything you create.</p>
      </div>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Your store</h3>
        <div className={bg.grid}>
          <div className={form.field}>
            <label htmlFor="brand-category" className={form.label}>Retail category</label>
            <select id="brand-category" className={form.input} value={value.category} onChange={(e) => set({ category: e.target.value })}>
              <option value="">Pick a retail category</option>
              {RETAIL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={form.field}>
            <span className={form.label}>Upload your logo</span>
            <label className={bg.fileButton}>
              <input type="file" accept="image/jpeg,image/png" onChange={(e) => onLogoFile(e.target.files?.[0])} hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {value.logoUrl && <img src={value.logoUrl} alt="" />}
              <span>{value.logoName || 'Upload file (max 2.5MB)'}</span>
            </label>
            {logoError && <p className={form.error}>{logoError}</p>}
          </div>
        </div>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Your colours</h3>
        <p className={card.sectionIntro}>Brand colours are used on Everyday content, Promotional colours on Promotional content.</p>
        <div className={styles.colours}>
          {COLOUR_FIELDS.map(({ key, label }) => (
            <div key={key} className={form.field}>
              <label htmlFor={`brand-${key}`} className={form.label}>{label}</label>
              <div className={bg.colourField}>
                <input
                  id={`brand-${key}`}
                  type="color"
                  className={bg.swatch}
                  value={value[key]}
                  onChange={(e) => onChange({ ...value, [key]: e.target.value })}
                />
                <input
                  className={form.input}
                  value={value[key].toUpperCase()}
                  aria-label={`${label} hex`}
                  onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && onChange({ ...value, [key]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={card.section}>
        <div className={choice.toolbar}>
          <h3 className={`${card.sectionTitle} ${styles.flexTitle}`}>How your brand carries across</h3>
          <div className={choice.segmented}>
            <button type="button" className={preview === 'everyday' ? choice.on : ''} onClick={() => setPreview('everyday')}>
              Everyday
            </button>
            <button type="button" className={preview === 'promo' ? choice.on : ''} onClick={() => setPreview('promo')}>
              Promotional
            </button>
          </div>
        </div>
        <div className={styles.previews}>
          {solutions.includes('paper') && (
            <figure className={styles.preview}>
              <div className={styles.paper}>
                <TicketBackground
                  kind={preview}
                  variant={0}
                  orientation="portrait"
                  header={header}
                  colour1={colours.colour1}
                  colour2={colours.colour2}
                  logoUrl={value.logoUrl}
                />
              </div>
              <figcaption>Paper ticket</figcaption>
            </figure>
          )}
          {solutions.includes('esl') && (
            <figure className={styles.preview}>
              <EslLabel
                model={findEsl('zkc42q')!}
                mode={preview}
                style={0}
                header={header}
                fontFamily={TICKET_FONTS[1].family}
                layout="price"
                logoUrl={value.logoUrl}
                product={product}
                maxHeight={220}
              />
              <figcaption>4.2&quot; ESL (black, white, red and yellow)</figcaption>
            </figure>
          )}
          {solutions.includes('screens') && (
            <figure className={`${styles.preview} ${styles.wide}`}>
              <ScreenContent
                model={findScreen('zkl290')!}
                mode={preview}
                style={0}
                colour1={colours.colour1}
                colour2={colours.colour2}
                header={header}
                logoUrl={value.logoUrl}
                motion="static"
                layout="single"
                products={[product]}
                maxHeight={220}
              />
              <figcaption>29&quot; Digital Screen</figcaption>
            </figure>
          )}
        </div>
      </section>

      <StepFooter onBack={onBack} nextLabel={nextLabel} onNext={onNext} />
    </div>
  );
};

export default BrandStep;
