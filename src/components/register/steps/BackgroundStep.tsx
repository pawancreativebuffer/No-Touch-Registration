"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import styles from './BackgroundStep.module.css';
import Carousel from '../ui/Carousel';
import TicketBackground from '../ui/TicketBackground';
import StepFooter from '../ui/StepFooter';
import { CORE_TEXTURES, EVERYDAY_HEADERS, PROMO_HEADERS, PROMO_STYLES, RETAIL_CATEGORIES } from '../data';
import { BackgroundSetup } from '../state';

const MAX_LOGO_BYTES = 2.5 * 1024 * 1024;

interface BackgroundStepProps {
  kind: 'everyday' | 'promo';
  value: BackgroundSetup;
  onChange: (value: BackgroundSetup) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const COPY = {
  everyday: {
    title: 'Let us build your Everyday ticket background',
    upload: 'If you already have your everyday ticket backgrounds, upload them here.',
    colour: 'Brand colour',
    headersLabel: 'Pick Everyday headers',
    portrait: 'Select your Portrait standard background',
    landscape: 'Select your Landscape Core background',
    ai: 'Let AI build your Everyday ticket',
  },
  promo: {
    title: 'Let us build your Promotional ticket background',
    upload: 'If you already have your promotional ticket backgrounds, upload them here.',
    colour: 'Promo colour',
    headersLabel: 'Pick Promotional headers',
    portrait: 'Select your promotional background',
    landscape: 'Promotional Ticket Suite',
    ai: 'Let AI build your Promo ticket',
  },
};

const BackgroundStep: React.FC<BackgroundStepProps> = ({ kind, value, onChange, onBack, onNext, nextLabel }) => {
  const [logoError, setLogoError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const copy = COPY[kind];
  const headerOptions = kind === 'everyday' ? EVERYDAY_HEADERS : PROMO_HEADERS;
  const variants = kind === 'everyday' ? CORE_TEXTURES.length : PROMO_STYLES.length;
  const header = value.headers[0] ?? '';

  const set = (patch: Partial<BackgroundSetup>) => onChange({ ...value, ...patch });

  const readImage = (file: File | undefined, apply: (name: string, url: string) => void) => {
    if (!file || !/^image\/(jpeg|png)$/.test(file.type)) return false;
    apply(file.name, URL.createObjectURL(file));
    return true;
  };

  const onBackgroundFile = (file: File | undefined) =>
    readImage(file, (uploadName, uploadUrl) => set({ uploadName, uploadUrl }));

  const onLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Logo must be 2.5MB or smaller.');
      return;
    }
    setLogoError(readImage(file, (logoName, logoUrl) => set({ logoName, logoUrl })) ? '' : 'Upload a JPEG or PNG file.');
  };

  const toggleHeader = (h: string) =>
    set({ headers: value.headers.includes(h) ? value.headers.filter((x) => x !== h) : [...value.headers, h] });

  // Prototype "AI": picks backgrounds and headers from the store category and colours
  const buildWithAi = () => {
    const seed = RETAIL_CATEGORIES.indexOf(value.category) + 1 + value.colour1.length;
    set({
      category: value.category || RETAIL_CATEGORIES[0],
      headers: value.headers.length ? value.headers : [headerOptions[0]],
      portraitIndex: seed % variants,
      portraitChosen: true,
      landscapeIndex: (seed + 2) % variants,
      landscapeChosen: true,
    });
  };

  const hasBackground = !!value.uploadUrl || (value.portraitChosen && value.landscapeChosen);
  const handleNext = () => {
    if (!hasBackground) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const renderBackground = (orientation: 'portrait' | 'landscape', variant: number) => (
    <TicketBackground
      kind={kind}
      variant={variant}
      orientation={orientation}
      header={header || headerOptions[0]}
      colour1={value.colour1}
      colour2={value.colour2}
      logoUrl={value.logoUrl}
    />
  );

  const variantIndexes = Array.from({ length: variants }, (_, i) => i);

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>{copy.title}</h2>
        <p className={card.subline}>Upload your own artwork, or tell us about your store and pick a design</p>
      </div>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Upload your backgrounds</h3>
        <p className={card.sectionIntro}>{copy.upload}</p>
        <label
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onBackgroundFile(e.dataTransfer.files[0]);
          }}
        >
          <input type="file" accept="image/jpeg,image/png" onChange={(e) => onBackgroundFile(e.target.files?.[0])} hidden />
          {value.uploadUrl ? (
            <span className={styles.uploaded}>
              <img src={value.uploadUrl} alt="" />
              <span>
                <strong>{value.uploadName}</strong>
                <small>We will size it to your selected ticket sizes. Click to replace.</small>
              </span>
            </span>
          ) : (
            <span>
              <strong>Drop a JPEG or PNG file here</strong>
              <small>or click to browse. We will size it to your selected ticket sizes.</small>
            </span>
          )}
        </label>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>Tell us about your store</h3>
        <p className={card.sectionIntro}>If you want us to build your backgrounds, tell us about your store.</p>
        <div className={styles.grid}>
          <div className={form.field}>
            <label htmlFor={`${kind}-category`} className={form.label}>Retail category</label>
            <select
              id={`${kind}-category`}
              className={form.input}
              value={value.category}
              onChange={(e) => set({ category: e.target.value })}
            >
              <option value="">Pick a retail category</option>
              {RETAIL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {(['colour1', 'colour2'] as const).map((key, i) => (
            <div key={key} className={form.field}>
              <label htmlFor={`${kind}-${key}`} className={form.label}>{copy.colour} {i + 1}</label>
              <div className={styles.colourField}>
                <input
                  id={`${kind}-${key}`}
                  type="color"
                  className={styles.swatch}
                  value={value[key]}
                  onChange={(e) => onChange({ ...value, [key]: e.target.value })}
                />
                <input
                  className={form.input}
                  value={value[key].toUpperCase()}
                  aria-label={`${copy.colour} ${i + 1} hex`}
                  onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && onChange({ ...value, [key]: e.target.value })}
                />
              </div>
            </div>
          ))}

          <div className={form.field}>
            <span className={form.label}>Upload your logo</span>
            <label className={styles.fileButton}>
              <input type="file" accept="image/jpeg,image/png" onChange={(e) => onLogoFile(e.target.files?.[0])} hidden />
              {value.logoUrl && <img src={value.logoUrl} alt="" />}
              <span>{value.logoName || 'Upload file (max 2.5MB)'}</span>
            </label>
            {logoError && <p className={form.error}>{logoError}</p>}
          </div>

          <div className={`${form.field} ${styles.span2}`}>
            <span className={form.label}>{copy.headersLabel}</span>
            <div className={styles.chips}>
              {headerOptions.map((h) => (
                <button
                  type="button"
                  key={h}
                  className={`${styles.chip} ${value.headers.includes(h) ? styles.chipOn : ''}`}
                  onClick={() => toggleHeader(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>{copy.portrait}</h3>
        <Carousel
          items={variantIndexes}
          index={value.portraitIndex}
          onIndexChange={(portraitIndex) => set({ portraitIndex, portraitChosen: false })}
          selected={value.portraitChosen}
          onSelect={() => set({ portraitChosen: !value.portraitChosen })}
          renderItem={(v) => renderBackground('portrait', v)}
          label="portrait background"
          height={260}
        />
      </section>

      <section className={card.section}>
        <h3 className={card.sectionTitle}>{copy.landscape}</h3>
        <Carousel
          items={variantIndexes}
          index={value.landscapeIndex}
          onIndexChange={(landscapeIndex) => set({ landscapeIndex, landscapeChosen: false })}
          selected={value.landscapeChosen}
          onSelect={() => set({ landscapeChosen: !value.landscapeChosen })}
          renderItem={(v) => renderBackground('landscape', v)}
          label="landscape background"
          height={190}
        />
      </section>

      <section className={card.section}>
        <div className={styles.ai}>
          <span>
            <strong>{copy.ai}</strong>
            <small>We will pick backgrounds and headers that suit your store and colours.</small>
          </span>
          <button type="button" className={`${form.button} ${styles.aiButton}`} onClick={buildWithAi}>
            <span className={form.buttonIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
              </svg>
            </span>
            <span className={form.buttonText}>Build with AI</span>
          </button>
        </div>
      </section>

      <StepFooter
        onBack={onBack}
        nextLabel={nextLabel}
        onNext={handleNext}
        error={
          showErrors && !hasBackground
            ? 'Upload your own background, or tick a portrait and a landscape background (or use Build with AI).'
            : ''
        }
      />
    </div>
  );
};

export default BackgroundStep;
