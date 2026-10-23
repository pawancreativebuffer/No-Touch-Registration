"use client";

import React from 'react';
import styles from './BrandSection.module.css';
import OrbitalHub, { OrbitalHubNode } from './OrbitalHub';
import { BrandSubStep } from './types';
import { BrandSetup, FontSetup } from '../register/state';
import { RETAIL_CATEGORIES } from '../register/data';
import { TICKET_FONTS } from '../register/fonts';

interface BrandSectionProps {
  brand: BrandSetup;
  onChangeBrand: (brand: BrandSetup) => void;
  font: FontSetup;
  onChangeFont: (font: FontSetup) => void;
  subStep: BrandSubStep;
  onSetSubStep: (step: BrandSubStep) => void;
  onBackToOverview: () => void;
}

const PRESET_PALETTES = [
  {
    name: 'Ticket-IT Classic',
    colour1: '#eb2771',
    colour2: '#2b253e',
    promo1: '#f73582',
    promo2: '#ffeb3b',
  },
  {
    name: 'Fresh Grocery',
    colour1: '#10b981',
    colour2: '#064e3b',
    promo1: '#ef4444',
    promo2: '#f59e0b',
  },
  {
    name: 'Warm Bakery',
    colour1: '#d97706',
    colour2: '#78350f',
    promo1: '#b45309',
    promo2: '#fef3c7',
  },
  {
    name: 'Modern Tech',
    colour1: '#2563eb',
    colour2: '#0f172a',
    promo1: '#06b6d4',
    promo2: '#38bdf8',
  },
  {
    name: 'Pharmacy & Wellness',
    colour1: '#059669',
    colour2: '#134e4a',
    promo1: '#3b82f6',
    promo2: '#dbeafe',
  },
  {
    name: 'Boutique & Fashion',
    colour1: '#8b5cf6',
    colour2: '#1e1b4b',
    promo1: '#ec4899',
    promo2: '#fdf2f8',
  },
];

const BrandSection: React.FC<BrandSectionProps> = ({
  brand,
  onChangeBrand,
  font,
  onChangeFont,
  subStep,
  onSetSubStep,
  onBackToOverview,
}) => {
  const setBrand = (patch: Partial<BrandSetup>) => onChangeBrand({ ...brand, ...patch });

  const onLogoFile = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBrand({ logoName: file.name, logoUrl: url });
  };

  // If in Hub mode, show the Brand Orbital Diagram (from Image 2)
  if (subStep === 'hub') {
    const nodes: OrbitalHubNode[] = [
      {
        id: 'logo',
        label: 'Upload logo',
        subtitle: 'Shared across all media',
        completed: Boolean(brand.logoUrl),
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        ),
      },
      {
        id: 'colours',
        label: 'Select colours',
        subtitle: 'Shared across all media',
        completed: Boolean(brand.coloursChosen),
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        ),
      },
      {
        id: 'font',
        label: 'Select font',
        subtitle: 'Shared across all media',
        completed: font.fontChosen,
        icon: (
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Aa</span>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={onBackToOverview}>
            ← Setup
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Brand',
            subtitle: 'Shared across all media',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"></path>
              </svg>
            ),
            onClick: onBackToOverview,
          }}
          nodes={nodes}
          onNodeClick={(id) => onSetSubStep(id as BrandSubStep)}
          caption="Set your brand once. It carries across Paper, ESL and Digital Screens."
        />
      </div>
    );
  }

  // Sub-step: Upload Logo
  if (subStep === 'logo') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          <button type="button" className={styles.backBtn} onClick={() => onSetSubStep('hub')}>
            ← Brand hub
          </button>
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Upload logo & store details</h3>
            <p className={styles.subStepDesc}>This logo will appear on all your printed tickets, shelf labels, and digital screens.</p>
          </div>
        </div>

        <div className={styles.contentCard}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="category-select" className={styles.label}>Retail Category</label>
              <select
                id="category-select"
                className={styles.select}
                value={brand.category}
                onChange={(e) => setBrand({ category: e.target.value })}
              >
                <option value="">Select your store category</option>
                {RETAIL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="store-name-input" className={styles.label}>Store Name</label>
              <input
                id="store-name-input"
                type="text"
                className={styles.input}
                placeholder="e.g. Your Store Name"
                value={brand.storeName ?? ''}
                onChange={(e) => setBrand({ storeName: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.fieldFull}>
            <label className={styles.label}>Store Logo</label>
            <label className={styles.uploadDropzone}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={(e) => onLogoFile(e.target.files?.[0])}
                hidden
              />
              {brand.logoUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brand.logoUrl} alt="Store Logo" className={styles.logoPreview} />
                  <span>{brand.logoName || 'Logo uploaded'}</span>
                  <button
                    type="button"
                    className={styles.removeLogoBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      setBrand({ logoUrl: '', logoName: '' });
                    }}
                  >
                    Remove logo
                  </button>
                </>
              ) : (
                <>
                  <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <strong>Click to upload store logo</strong>
                  <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    PNG, JPEG or SVG (up to 2.5MB)
                  </span>
                </>
              )}
            </label>
          </div>

          <div className={styles.actionFooter}>
            <button type="button" className={styles.doneBtn} onClick={() => onSetSubStep('hub')}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sub-step: Select Colours
  if (subStep === 'colours') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          <button type="button" className={styles.backBtn} onClick={() => onSetSubStep('hub')}>
            ← Brand hub
          </button>
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Select brand & promotional colours</h3>
            <p className={styles.subStepDesc}>Brand colours are used for everyday ticketing; promotional colours are used for sales & deals.</p>
          </div>
        </div>

        <div className={styles.contentCard}>
          <div className={styles.coloursGrid}>
            <div className={styles.colourCard}>
              <span className={styles.label}>Everyday Primary</span>
              <div className={styles.colourRow}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={brand.colour1}
                  onChange={(e) => setBrand({ colour1: e.target.value })}
                />
                <input
                  type="text"
                  className={styles.hexInput}
                  value={brand.colour1.toUpperCase()}
                  onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && setBrand({ colour1: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.colourCard}>
              <span className={styles.label}>Everyday Secondary</span>
              <div className={styles.colourRow}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={brand.colour2}
                  onChange={(e) => setBrand({ colour2: e.target.value })}
                />
                <input
                  type="text"
                  className={styles.hexInput}
                  value={brand.colour2.toUpperCase()}
                  onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && setBrand({ colour2: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.colourCard}>
              <span className={styles.label}>Promotional Primary</span>
              <div className={styles.colourRow}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={brand.promo1}
                  onChange={(e) => setBrand({ promo1: e.target.value })}
                />
                <input
                  type="text"
                  className={styles.hexInput}
                  value={brand.promo1.toUpperCase()}
                  onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && setBrand({ promo1: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.colourCard}>
              <span className={styles.label}>Promotional Secondary</span>
              <div className={styles.colourRow}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={brand.promo2}
                  onChange={(e) => setBrand({ promo2: e.target.value })}
                />
                <input
                  type="text"
                  className={styles.hexInput}
                  value={brand.promo2.toUpperCase()}
                  onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && setBrand({ promo2: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className={styles.presetsWrap}>
            <div className={styles.presetsTitle}>Or choose a curated palette:</div>
            <div className={styles.presetsList}>
              {PRESET_PALETTES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className={styles.presetBtn}
                  onClick={() =>
                    setBrand({
                      colour1: preset.colour1,
                      colour2: preset.colour2,
                      promo1: preset.promo1,
                      promo2: preset.promo2,
                    })
                  }
                >
                  <span className={styles.presetName}>{preset.name}</span>
                  <div className={styles.presetDots}>
                    <span className={styles.dot} style={{ background: preset.colour1 }} />
                    <span className={styles.dot} style={{ background: preset.colour2 }} />
                    <span className={styles.dot} style={{ background: preset.promo1 }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actionFooter}>
            <button
              type="button"
              className={styles.doneBtn}
              onClick={() => {
                setBrand({ coloursChosen: true });
                onSetSubStep('hub');
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sub-step: Select Font
  return (
    <div className={styles.sectionWrap}>
      <div className={styles.subStepHeader}>
        <button type="button" className={styles.backBtn} onClick={() => onSetSubStep('hub')}>
          ← Brand hub
        </button>
        <div className={styles.titleWrap}>
          <h3 className={styles.subStepTitle}>Select typography</h3>
          <p className={styles.subStepDesc}>Choose the Google Font that matches your brand personality. It will format all ticket headers and prices.</p>
        </div>
      </div>

      <div className={styles.contentCard}>
        <div className={styles.fontGrid}>
          {TICKET_FONTS.map((tf, i) => {
            const isSelected = font.fontIndex === i;
            return (
              <div
                key={tf.name}
                className={`${styles.fontCard} ${isSelected ? styles.fontCardActive : ''}`}
                onClick={() =>
                  onChangeFont({
                    ...font,
                    fontIndex: i,
                    fontChosen: true,
                  })
                }
              >
                <div className={styles.fontCardTop}>
                  <span className={styles.fontName}>{tf.name}</span>
                  {isSelected && (
                    <span className={styles.checkBadge}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                </div>
                <div className={styles.fontSample} style={{ fontFamily: tf.family }}>
                  $3.49 Fresh Bananas
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actionFooter}>
          <button type="button" className={styles.doneBtn} onClick={() => onSetSubStep('hub')}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;
